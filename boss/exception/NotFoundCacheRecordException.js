const {StatusCodes} = require('http-status-codes')

class NotFoundCacheRecordException extends Error {
  constructor() {
    super()
    this.message = 'caching된 데이터가 존재하지 않습니다'
    this.StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
  }
}

module.exports = NotFoundCacheRecordException
