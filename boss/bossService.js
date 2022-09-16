const dto = require('./dto/bossState')
const bossRepository = require('./bossRepository')

const getBossState = bossStateCache => {
  return dto.getBossState(bossStateCache)
}

const startBossRaid = async (bossStateCache, requestRaids) => {
  const newRecord = dto.crateNewRaidBossRecord(
    bossStateCache.bossRaids,
    requestRaids,
  )
  const result = await bossRepository.createBossRaidRecord(newRecord)
  dto.setCache(bossStateCache, result)
  return dto.getStartBossInformation(result)
}

module.exports = {
  getBossState,
  startBossRaid,
}
