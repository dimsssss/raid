const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const userService = require('./userService')

const createUser = async (validator, req, res) => {
  if (validator.error instanceof Error) {
    return res.status(StatusCodes.BAD_REQUEST).send(validator.error.details)
  }

  try {
    const result = await userService.signUp(req.query.userId)
    return res.status(StatusCodes.CREATED).send({userId: result.userId})
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

module.exports = {
  createUser,
}
