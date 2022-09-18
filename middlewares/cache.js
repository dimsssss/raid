const bossRepository = require('../boss/bossRepository')

const getRaidRecord = async () => {
  try {
    return await bossRepository.findLatestRaidRecord()
  } catch (err) {
    throw new Error()
  }
}

const initRaidRecord = async bossRaidCache => {
  const cacheRecord = await getRaidRecord()
  if (cacheRecord) {
    bossRaidCache['data'] = cacheRecord
  }
}

module.exports = initRaidRecord
