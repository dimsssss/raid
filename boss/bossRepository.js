const db = require('../bin/database')
const ExternalSystemException = require('./exception/ExternalSystemException')
const {sequelize} = db
const {Op} = db.Sequelize

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

/**
 * soft delete. 실제로 삭제되지 않고 deletedAt에 시간이 들어간다
 * @param {*} record
 * @returns
 */
const updateRaidRecord = async record => {
  try {
    const {raidRecords} = db
    return await raidRecords.update(
      {state: 'end'},
      {
        raw: true,
        where: {
          raidRecordId: record.raidRecordId,
          userId: record.userId,
        },
      },
    )
  } catch (err) {
    new ExternalSystemException(err)
  }
}

const findAllUserRecord = async userId => {
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

module.exports = {
  createBossRaidRecord,
  updateRaidRecord,
  findAllUserRecord,
}
