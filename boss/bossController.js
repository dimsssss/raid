const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const bossService = require('./bossService')

const getBossState = (req, res) => {
  try {
    const {bossStateCache} = req.app.get('bossStateCache')
    const result = bossService.getBossState(bossStateCache)
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

module.exports = {
  getBossState,
}
