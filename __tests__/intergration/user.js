/* global describe, test, beforeAll, afterAll, expect */
describe('유저 통합테스트', () => {
  const userHelper = require('../helper/user')
  const bossHelper = require('../helper/boss')
  let raidData

  beforeAll(async () => {
    raidData = await bossHelper.initData()
  })

  afterAll(async () => {
    await userHelper.cleanDatabase()
    await bossHelper.cleanDatabase()
  })

  test('한명의 유저를 생성할 수 있다', async () => {
    const {users} = require('../../bin/database')
    const userService = require('../../user/userService')
    const newUser = await userService.signUp()
    const user = await users.findByPk(newUser.userId, {raw: true})

    expect(newUser.userId).toEqual(user.userId)
  })

  test('한명의 유저에 대한 레이드 기록을 조회할 수 있다', async () => {
    const bossService = require('../../boss/bossService')
    const userId = 1
    let userRecordCount = 0
    const totalScore = raidData.reduce((accumulate, record) => {
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
