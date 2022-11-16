require('dotenv').config()

const db = require('../../bin/database')
const {redis} = require('../../bin/redis')
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
    {
      raidRecordId: 6,
      userId: 2,
      state: 'end',
      score: 50,
      createdAt: '2022-09-16 19:00',
      updatedAt: '2022-09-16 19:03',
    },
    {
      raidRecordId: 7,
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
    const {raidRecords, bossStates} = db
    const data = createRaidRecord()
    await bossStates.create()
    const result = await raidRecords.bulkCreate(data, {raw: true})
    await setCache()
    return result
  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
}

const cleanDatabase = async () => {
  try {
    const {raidRecords, bossStates} = db
    await raidRecords.destroy({where: {}, force: true, truncate: true})
    await bossStates.destroy({where: {}, force: true, truncate: true})
  } catch (err) {
    throw new Error(err)
  }
}

const orderByScore = records => {
  const users = records.map(record => {
    return record.userId
  })

  const orderdIds = new Set(users)
  const ranks = []
  orderdIds.forEach(id => {
    const rankInfo = {userId: id, totalScore: 0}
    records.forEach(record => {
      if (record.userId === id && record.state === 'end') {
        rankInfo.totalScore += record.score
      }
    })
    if (rankInfo.totalScore !== 0) {
      ranks.push(rankInfo)
    }
  })
  ranks.sort((a, b) => {
    return a.totalScore - b.totalScore > 0
  })

  ranks.forEach((rank, index) => {
    rank.ranking = index
  })

  return ranks
}

const setCache = async () => {
  try {
    const bossRepository = require('../../src/boss/domain/bossRepository')
    const rankers = await bossRepository.findRanker()
    await redis.set('ranking', JSON.stringify(rankers))
  } catch (err) {
    throw new Error()
  }
}

module.exports = {
  initData,
  cleanDatabase,
  orderByScore,
  setCache,
}
