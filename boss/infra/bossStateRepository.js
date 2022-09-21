const db = require('../../bin/database')
const ExternalSystemException = require('../exception/ExternalSystemException')

const initBossState = async () => {
  try {
    const {bossStates} = db
    await bossStates.create({raw: true})
  } catch (err) {
    throw new ExternalSystemException(err)
  }
}

module.exports = {initBossState}
