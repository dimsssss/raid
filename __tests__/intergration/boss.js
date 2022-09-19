/* global describe, test, beforeAll, afterAll, expect */
describe('boss raid 통합테스트', () => {
  const helper = require('../helper/boss')
  const db = require('../../bin/database')
  const {init, redis} = require('../../bin/redis')
  const {requestBossState} = require('../../bin/bossStateAPI')
  let bossRaidCache
  let raidRecords

  beforeAll(async () => {
    await Promise.all([init(), requestBossState(), helper.initData()]).then(
      async result => {
        raidRecords = result[2]
        bossRaidCache = {
          bossState: result[1].bossRaids[0],
          ranking: {
            topRankerInfoList: [],
          },
        }
      },
    )
  })

  afterAll(async () => {
    await helper.cleanDatabase()
  })

  test.each([
    [
      {
        userId: 1,
        level: 1,
      },
    ],
  ])('level 1 입장이 가능하다', async newRecord => {
    const {raidRecords} = db

    const bossService = require('../../boss/bossService')
    const result = await bossService.startBossRaid(bossRaidCache, newRecord)
    const record = await raidRecords.findOne({
      order: [['raidRecordId', 'DESC']],
      limit: 1,
    })
    expect(result.isEntered).toEqual(true)
    expect(record.userId).toEqual(newRecord.userId)
  })

  test('제한 시간이 초과되고 boss raid를 종료하면 예외를 반환한다', async () => {
    const exceedTimeRecord = raidRecords[4]
    bossRaidCache.data = exceedTimeRecord
    const bossService = require('../../boss/bossService')
    const record = {
      userId: exceedTimeRecord.userId,
      raidRecordId: exceedTimeRecord.raidRecordId,
    }
    await expect(
      bossService.endBossRaid(bossRaidCache, record),
    ).rejects.toThrowError(Error)
  })

  test('boss raid를 랭킹을 조회할 수 있다', async () => {
    const bossService = require('../../boss/bossService')
    const orderedRanks = helper.orderByScore(raidRecords)
    await redis.set(
      `userId:1`,
      JSON.stringify({
        userId: 1,
        totalScore: orderedRanks[0].totalScore,
        ranking: 0,
      }),
    )
    const rankings = await bossService.getRankers(1)
    rankings.topRankerInfoList.forEach((record, index) => {
      expect(record.userId).toEqual(orderedRanks[index].userId)
      expect(Number(record.totalScore)).toEqual(orderedRanks[index].totalScore)
      expect(record.ranking).toEqual(orderedRanks[index].ranking)
    })
    expect(rankings.myRankingInfo.userId).toEqual(orderedRanks[0].userId)
    expect(Number(rankings.myRankingInfo.totalScore)).toEqual(
      orderedRanks[0].totalScore,
    )
    expect(rankings.myRankingInfo.ranking).toEqual(orderedRanks[0].ranking)
  })

  test('boss raid를 종료할 수 있다', async () => {
    const raidRecord = raidRecords[6]
    const newBossRaidCache = Object.assign(bossRaidCache)
    newBossRaidCache.data = raidRecord
    const bossService = require('../../boss/bossService')
    const record = {
      userId: raidRecord.userId,
      raidRecordId: raidRecord.raidRecordId,
    }

    await expect(
      bossService.endBossRaid(newBossRaidCache, record),
    ).resolves.toEqual([1])
  })

  test('한명의 유저에 대한 레이드 기록을 조회할 수 있다', async () => {
    const bossService = require('../../boss/bossService')
    const userId = 1
    let userRecordCount = 0
    const totalScore = raidRecords.reduce((accumulate, record) => {
      if (record.userId === userId && record.state === 'end') {
        userRecordCount += 1
        return accumulate + record.score
      }
      return accumulate
    }, 0)

    const userRaidRecords = await bossService.getUserRaidRecordAndTotalScore(
      userId,
    )
    expect(userRaidRecords.bossRaidHistory.length).toEqual(userRecordCount)
    expect(userRaidRecords.totalScore).toEqual(totalScore)
  })
})
