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

module.exports = {
  createBossRaidRecord,
}
