const {Sequelize} = require('../../../bin/database')
const db = require('../../../bin/database')
const ExternalSystemException = require('../exception/ExternalSystemException')
const BossRaidingException = require('../exception/BossRaidingException')
const {sequelize} = db
const {Op} = Sequelize

const createBossRaidRecord = async record => {
  return await sequelize
    .transaction(async transaction => {
      const {raidRecords, bossStates} = db
      const bossState = await bossStates.findOne({
        where: {state: 'open', bossId: 1},
        transaction,
        raw: true,
      })

      if (bossState === null) {
        throw new BossRaidingException()
      }

      const updateState = await bossStates.update(
        {state: 'close'},
        {
          where: {
            state: 'open',
            bossId: bossState.bossId,
          },
          lock: true,
          raw: true,
          transaction,
        },
      )

      if (updateState[0] === 0) {
        throw new BossRaidingException()
      }

      const result = await raidRecords.create(record, {
        raw: true,
        transaction,
      })
      return result
    })
    .catch(err => {
      throw new ExternalSystemException(err)
    })
}

const endBossRaid = async record => {
  return sequelize
    .transaction(async transaction => {
      const {raidRecords} = db
      const deletedRecord = await raidRecords.update(
        {state: 'end'},
        {
          raw: true,
          where: {
            raidRecordId: record.raidRecordId,
            userId: record.userId,
          },
          transaction,
        },
      )
      const ranking = await sequelize.query(
        `SELECT userId, 
                SUM(score) AS totalScore, 
                DENSE_RANK() OVER (ORDER BY SUM(score) DESC) - 1 AS ranking 
           FROM raidRecords WHERE state = 'end' GROUP BY userId ORDER BY ranking ASC;`,
        {type: Sequelize.QueryTypes.SELECT, raw: true, transaction},
      )
      return [deletedRecord, ranking]
    })
    .catch(err => {
      throw new ExternalSystemException(err)
    })
}

const findAllUserRaidRecord = async userId => {
  const {raidRecords} = db
  return await sequelize
    .transaction(async transaction => {
      const userRecords = await raidRecords.findAll({
        raw: true,
        transaction,
        attributes: [
          'raidRecordId',
          'score',
          ['createdAt', 'enterTime'],
          ['updatedAt', 'endTime'],
        ],
        where: {
          userId,
          state: {
            [Op.eq]: 'end',
          },
        },
      })

      const totalScore = await raidRecords.sum('score', {
        where: {
          userId,
          state: {
            [Op.eq]: 'end',
          },
        },
        transaction,
        raw: true,
      })
      return {
        totalScore,
        bossRaidHistory: userRecords,
      }
    })
    .catch(err => {
      throw new ExternalSystemException(err)
    })
}

const findRanker = async () => {
  try {
    const rankingRecords = await sequelize.query(
      `SELECT userId, 
              SUM(score) AS totalScore, 
              DENSE_RANK() OVER (ORDER BY SUM(score) DESC) - 1 AS ranking 
         FROM raidRecords WHERE state = 'end' GROUP BY userId ORDER BY ranking ASC;`,
      {type: Sequelize.QueryTypes.SELECT, raw: true},
    )
    return rankingRecords
  } catch (err) {
    throw new ExternalSystemException(err)
  }
}

const findLatestRaidRecord = async () => {
  return await sequelize
    .transaction(async transaction => {
      const {raidRecords} = db
      const record = await raidRecords.findOne({
        order: [['raidRecordId', 'DESC']],
        limit: 1,
        raw: true,
        transaction,
      })
      const ranking = await sequelize.query(
        `SELECT userId, 
                SUM(score) AS totalScore, 
                DENSE_RANK() OVER (ORDER BY SUM(score) DESC) - 1 AS ranking 
           FROM raidRecords WHERE state = 'end' GROUP BY userId ORDER BY ranking ASC;`,
        {type: Sequelize.QueryTypes.SELECT, raw: true, transaction},
      )
      return [record, ranking]
    })
    .catch(err => {
      throw new ExternalSystemException(err)
    })
}

const updateStateToTimeout = async raidRecordId => {
  try {
    const {raidRecords} = db
    const result = await raidRecords.update(
      {state: 'timeout'},
      {where: {raidRecordId}, raw: true},
    )
    return result
  } catch (err) {
    console.log(err)
    throw new ExternalSystemException(err)
  }
}

module.exports = {
  createBossRaidRecord,
  endBossRaid,
  findAllUserRaidRecord,
  findRanker,
  findLatestRaidRecord,
  updateStateToTimeout,
}
