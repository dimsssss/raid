/* global describe, test, beforeAll, afterAll, expect */
describe('boss raid 통합테스트', () => {
  const helper = require('../helper/boss')
  const db = require('../../bin/database')
  let bossStateCache
  let raidRecords
  beforeAll(async () => {
    bossStateCache = {
      bossRaids: {
        bossRaidLimitSeconds: 180,
        levels: [
          {
            level: 0,
            score: 20,
          },
          {
            level: 1,
            score: 47,
          },
          {
            level: 2,
            score: 85,
          },
        ],
      },
    }
    raidRecords = await helper.initData()
  })

  afterAll(async () => {
    await helper.cleanDatabase()
  })

  test.each([
    [
      {
        userId: 1,
        level: 0,
      },
    ],
    [
      {
        userId: 2,
        level: 1,
      },
    ],
    [
      {
        userId: 3,
        level: 2,
      },
    ],
  ])('level %o 입장이 가능하다', async newRecord => {
    const {raidRecords} = db

    const bossService = require('../../boss/bossService')
    const result = await bossService.startBossRaid(bossStateCache, newRecord)
    const record = await raidRecords.findOne({
      order: [['raidRecordId', 'DESC']],
      limit: 1,
    })
    expect(result.isEntered).toEqual(true)
    expect(record.userId).toEqual(newRecord.userId)
  })

  test('제한 시간이 초과되고 boss raid를 종료하면 예외를 반환한다', async () => {
    const exceedTimeRecord = raidRecords[4]
    bossStateCache.data = exceedTimeRecord
    const bossService = require('../../boss/bossService')
    const record = {
      userId: exceedTimeRecord.userId,
      raidRecordId: exceedTimeRecord.raidRecordId,
    }
    await expect(
      bossService.endBossRaid(bossStateCache, record),
    ).rejects.toThrowError(Error)
  })

  test('boss raid를 종료할 수 있다', async () => {
    const raidRecord = raidRecords[1]
    bossStateCache.data = raidRecord
    const bossService = require('../../boss/bossService')
    const record = {
      userId: raidRecord.userId,
      raidRecordId: raidRecord.raidRecordId,
    }
    await expect(
      bossService.endBossRaid(bossStateCache, record),
    ).resolves.toEqual([1])
  })

  test('boss raid를 랭킹을 조회할 수 있다', async () => {
    const bossService = require('../../boss/bossService')
    const rankings = await bossService.getRankers(1)
    const orderedRanks = helper.orderByScore(raidRecords)

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
