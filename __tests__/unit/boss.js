/* global describe test expect */
describe('boss raid 확인 테스트', () => {
  test.each([
    [{}, {canEnter: true}],
    [
      {
        data: {
          userId: 1,
          createdAt: '2022-09-16 18:02',
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
    const bossService = require('../../src/boss/bossService')
    expect(bossService.getBossState(stateCache)).toEqual(expected)
  })
})
