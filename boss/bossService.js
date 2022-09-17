const dto = require('./dto/bossState')
const bossRepository = require('./bossRepository')
const raidValidator = require('./RaidValidator')

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

const endBossRaid = async (bossStateCache, requestRaids) => {
  if (!raidValidator.isValid(bossStateCache, requestRaids)) {
    throw new Error()
  }
  if (raidValidator.isExcedTime(bossStateCache.data)) {
    throw new Error()
  }
  const result = await bossRepository.updateRaidRecord(bossStateCache.data)
  dto.setCache(bossStateCache, undefined)
  return result
}

const getUserRaidRecordAndTotalScore = async userId => {
  const result = await bossRepository.findAllUserRecord(userId)
  return result
}

module.exports = {
  getBossState,
  startBossRaid,
  endBossRaid,
  getUserRaidRecordAndTotalScore,
}
