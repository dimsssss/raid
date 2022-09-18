const {StatusCodes} = require('http-status-codes')
const bossService = require('../bossService')

const getBossState = async (req, res) => {
  try {
    const bossRaidCache = req.app.get('bossRaidCache')
    const result = await bossService.getBossState(bossRaidCache)
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res.status(err.StatusCodes).send(err.message)
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
    return res.status(err.StatusCodes).send(err.message)
  }
}

const finishBossRaid = async (validator, req, res) => {
  try {
    if (validator.error) {
      return res.status(StatusCodes.BAD_REQUEST).send(validator.error.message)
    }

    const bossRaidCache = req.app.get('bossRaidCache')
    const result = await bossService.endBossRaid(bossRaidCache, validator.value)
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res.status(err.StatusCodes).send(err.message)
  }
}

const getRankings = async (req, res) => {
  try {
    const bossRaidCache = req.app.get('bossRaidCache')
    const result = await bossService.getRankers(bossRaidCache)
    return res.status(StatusCodes.OK).send(result)
  } catch (err) {
    return res.status(err.StatusCodes).send(err.message)
  }
}

module.exports = {
  getBossState,
  enterBossRaid,
  finishBossRaid,
  getRankings,
}
