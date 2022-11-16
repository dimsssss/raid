/* global process */

require('dotenv').config()

const https = require('https')
const ExternalSystemException = require('../src/boss/exception/ExternalSystemException')
const initRaidRecord = require('../src/middlewares/cache')

const options = {
  hostname: process.env.BOSS_STATE_URL,
  path: `/assignment/backend/bossRaidData.json`,
}

const requestBossState = () => {
  return new Promise((resoleve, rejects) => {
    const req = https.get(options, res => {
      res.setEncoding('utf8')
      res.on('data', d => {
        resoleve(JSON.parse(d))
      })
    })
    req.on('error', err => {
      rejects(err)
    })
  })
}

const setBossStateTo = async (bossRaidCache, staticBossState, redis) => {
  try {
    bossRaidCache.bossState = staticBossState.bossRaids[0]
    await initRaidRecord(bossRaidCache, redis)
  } catch (err) {
    throw new ExternalSystemException(err)
  }
}

module.exports = {
  setBossStateTo,
  requestBossState,
}
