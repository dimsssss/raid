const {StatusCodes} = require('http-status-codes')

class NotFoundRankingException extends Error {
  constructor() {
    super()
    this.message = '존재하는 랭킹 정보가 없습니다'
    this.StatusCodes = StatusCodes.OK
  }
}

module.exports = NotFoundRankingException
