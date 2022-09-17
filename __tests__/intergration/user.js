/* global describe, test, expect */
describe('유저 통합테스트', () => {
  test('한명의 유저를 생성할 수 있다', async () => {
    const {users} = require('../../bin/database')
    const userService = require('../../user/userService')
    const newUser = await userService.signUp()
    const user = await users.findByPk(newUser.userId, {raw: true})

    expect(newUser.userId).toEqual(user.userId)
  })
})
