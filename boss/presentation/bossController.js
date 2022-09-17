const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const bossService = require('../bossService')

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

const enterBossRaid = (validator, req, res) => {
  try {
    if (validator.error) {
      return res.status(StatusCodes.BAD_REQUEST).send(validator.error.message)
    }

    const {bossStateCache} = req.app.get('bossStateCache')
    const result = bossService.startBossRaid(bossStateCache, validator.value)
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

const finishBossRaid = (validator, req, res) => {
  try {
    if (validator.error) {
      return res.status(StatusCodes.BAD_REQUEST).send(validator.error.message)
    }

    const {bossStateCache} = req.app.get('bossStateCache')
    const result = bossService.endBossRaid(bossStateCache, validator.value)
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

const getRankings = (validator, req, res) => {
  try {
    if (validator.error) {
      return res.status(StatusCodes.BAD_REQUEST).send(validator.error.message)
    }

    const result = bossService.getRankers(validator.value)
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

module.exports = {
  getBossState,
  enterBossRaid,
  finishBossRaid,
  getRankings,
}
