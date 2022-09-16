/* global describe, test, beforeAll, afterAll, expect */
describe('boss raid 통합테스트', () => {
  const helper = require('../helper/boss')
  const db = require('../../bin/database')
  let bossStateCache

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
})
