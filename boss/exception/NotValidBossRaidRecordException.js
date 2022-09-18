const {StatusCodes} = require('http-status-codes')

class NotValidBossRaidRecordException extends Error {
  constructor() {
    super()
    this.message = '유효한 boss Raid 기록이 아닙니다'
    this.StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
  }
}

module.exports = NotValidBossRaidRecordException
