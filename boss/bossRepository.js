const {Sequelize} = require('../bin/database')
const db = require('../bin/database')
const ExternalSystemException = require('./exception/ExternalSystemException')
const {sequelize} = db
const {Op} = Sequelize

const createBossRaidRecord = async record => {
  try {
    const {raidRecords} = db
    return await raidRecords.create(record, {
      raw: true,
    })
  } catch (err) {
    new ExternalSystemException(err)
  }
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

module.exports = {
  createBossRaidRecord,
  endBossRaid,
  findAllUserRaidRecord,
  findRanker,
  findLatestRaidRecord,
}
