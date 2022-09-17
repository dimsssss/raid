const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const userService = require('../userService')
const bossService = require('../../boss/bossService')

const createUser = async (req, res) => {
  try {
    const result = await userService.signUp()
    return res.status(StatusCodes.CREATED).send({userId: result.userId})
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

const getUserRaidRecords = async (validator, req, res, next) => {
  try {
    if (validator.error instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).send(validator.error.details)
    }
    const result = await bossService.getUserRaidRecordAndTotalScore(
      validator.value,
    )
    if (result) {
      return res.status(StatusCodes.OK).send(result)
    }
    return res.status(StatusCodes.OK).send()
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

module.exports = {
  createUser,
  getUserRaidRecords,
}
