const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const bossService = require('../bossService')

const getBossState = (req, res) => {
  try {
    const {bossRaidCache} = req.app.get('bossRaidCache')
    const result = bossService.getBossState(bossRaidCache)
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

    const {bossRaidCache} = req.app.get('bossRaidCache')
    const result = bossService.startBossRaid(bossRaidCache, validator.value)
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

    const {bossRaidCache} = req.app.get('bossRaidCache')
    const result = bossService.endBossRaid(bossRaidCache, validator.value)
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
