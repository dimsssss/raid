const {StatusCodes} = require('http-status-codes')

class StartBossRaidException extends Error {
  constructor(userId) {
    super()
    this.message = `boss Raid를 신청할 수 없습니다. 요청 유저아이디 ${userId}`
    this.StatusCodes = StatusCodes.BAD_REQUEST
  }
}

module.exports = StartBossRaidException
