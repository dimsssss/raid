/* global describe test expect beforeAll afterAll */
describe('boss raid 확인 테스트', () => {
  test.each([
    [{}, {canEnter: true}],
    [
      {
        data: {
          userId: 1,
          createdAt: new Date('2022-09-16 18:02').getDate(),
          state: 'start',
        },
      },
      {canEnter: true},
    ],
    [
      {
        data: {
          userId: 1,
          createdAt: Date.now(),
          state: 'start',
        },
      },
      {canEnter: false, userId: 1},
    ],
    [
      {
        data: {
          userId: 1,
          createdAt: Date.now(),
          state: 'end',
        },
      },
      {canEnter: true},
    ],
  ])('입력 %p 결과 %p', (stateCache, expected) => {
    const validateBossRaid = require('../../boss/dto/raidRecord')
    expect(validateBossRaid.getBossState(stateCache)).toEqual(expected)
  })
})
