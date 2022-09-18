/* global process */

require('dotenv').config()

const https = require('https')
const ExternalSystemException = require('../boss/exception/ExternalSystemException')
const initRaidRecord = require('../middlewares/cache')

const options = {
  hostname: process.env.BOSS_STATE_URL,
  path: `/assignment/backend/bossRaidData.json`,
}

const requestBossState = () => {
  return new Promise((resoleve, rejects) => {
    const req = https.get(options, res => {
      res.setEncoding('utf8')
      res.on('data', d => {
        resoleve(d)
      })
    })
    req.on('error', err => {
      rejects(err)
    })
  })
}

const setBossStateTo = async bossRaidCache => {
  try {
    const response = await requestBossState()
    const staticBossState = JSON.parse(response)
    bossRaidCache.bossState = staticBossState.bossRaids[0]
    await initRaidRecord(bossRaidCache)
  } catch (err) {
    throw new ExternalSystemException(err)
  }
}

const getBossState = async () => {
  try {
    const response = await requestBossState()
    return JSON.parse(response)
  } catch (err) {
    throw new ExternalSystemException(err)
  }
}

module.exports = {
  setBossStateTo,
  getBossState,
}
