const db = require('../bin/database')
const ExternalSystemException = require('./exception/ExternalSystemException')

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
const deleteRaidRecord = async record => {
  try {
    const {raidRecords} = db
    return await raidRecords.destroy({
      raw: true,
      where: {
        raidRecordId: record.raidRecordId,
        userId: record.userId,
      },
    })
  } catch (err) {
    new ExternalSystemException(err)
  }
}

module.exports = {
  createBossRaidRecord,
  deleteRaidRecord,
}
