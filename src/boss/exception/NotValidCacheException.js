const {StatusCodes} = require('http-status-codes')

class NotValidCacheException extends Error {
  constructor(message) {
    super()
    this.message = message
    this.StatusCodes = StatusCodes.INTERNAL_SERVER_ERROR
  }
}

module.exports = NotValidCacheException
