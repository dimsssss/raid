require('dotenv').config()

const db = require('../../bin/database')
const createRaidRecord = () => {
  return [
    {
      raidRecordId: 1,
      userId: 1,
      state: 'end',
      score: 50,
      createdAt: '2022-09-16 18:00',
      updatedAt: '2022-09-16 18:00',
    },
    {
      raidRecordId: 2,
      userId: 1,
      state: 'end',
      score: 50,
      createdAt: '2022-09-16 18:05',
      updatedAt: '2022-09-16 18:08',
    },
    {
      raidRecordId: 3,
      userId: 1,
      state: 'end',
      score: 30,
      createdAt: '2022-09-16 18:11',
      updatedAt: '2022-09-16 18:14',
    },
    {
      raidRecordId: 4,
      userId: 2,
      state: 'start',
      score: 50,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    {
      raidRecordId: 5,
      userId: 1,
      state: 'start',
      score: 50,
      createdAt: '2022-09-16 18:00',
      updatedAt: '2022-09-16 18:00',
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
