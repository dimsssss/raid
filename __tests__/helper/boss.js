require('dotenv').config()

const db = require('../../bin/database')
const createRaidRecord = () => {
  return [
    {
      raidRecordId: 1,
      userId: 1,
      state: 'start',
      score: 50,
      createdAt: new Date('2022-09-16 18:00').getDate(),
      updatedAt: new Date('2022-09-16 18:00').getDate(),
    },
    {
      raidRecordId: 2,
      userId: 2,
      state: 'start',
      score: 50,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ]
}
const initData = async () => {
  try {
    const {raidRecords} = db
    const data = createRaidRecord()
    return await raidRecords.bulkCreate(data, {raw: true})
  } catch (err) {
    throw new Error(err)
  }
}

const cleanDatabase = async () => {
  try {
    const {raidRecords} = db
    await raidRecords.destroy({where: {}, force: true, truncate: true})
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  initData,
  cleanDatabase,
}
