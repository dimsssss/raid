const {StatusCodes, getReasonPhrase} = require('http-status-codes')
const bossService = require('../bossService')

const getBossState = async (req, res) => {
  try {
    const {bossRaidCache} = req.app.get('bossRaidCache')
    const result = await bossService.getBossState(bossRaidCache)
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

const enterBossRaid = async (validator, req, res, next) => {
  try {
    if (validator.error) {
      return res.status(StatusCodes.BAD_REQUEST).send(validator.error.message)
    }

    const bossRaidCache = req.app.get('bossRaidCache')
    const result = await bossService.startBossRaid(
      bossRaidCache,
      validator.value,
    )
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

const finishBossRaid = async (validator, req, res) => {
  try {
    if (validator.error) {
      return res.status(StatusCodes.BAD_REQUEST).send(validator.error.message)
    }

    const {bossRaidCache} = req.app.get('bossRaidCache')
    const result = await bossService.endBossRaid(bossRaidCache, validator.value)
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR))
  }
}

const getRankings = async (validator, req, res) => {
  try {
    if (validator.error) {
      return res.status(StatusCodes.BAD_REQUEST).send(validator.error.message)
    }

    const result = await bossService.getRankers(validator.value)
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
