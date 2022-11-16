const {StatusCodes} = require('http-status-codes')

class BossRaidingException extends Error {
  constructor() {
    super()
    this.StatusCodes = StatusCodes.CONFLICT
    this.message = '현재 레이드가 진행중입니다'
  }
}

module.exports = BossRaidingException
