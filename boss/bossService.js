const dto = require('./dto/raidRecord')
const bossRepository = require('./bossRepository')
const raidValidator = require('./RaidValidator')
const NotValidBossRaidRecordException = require('./exception/NotValidBossRaidRecordException')
const ExcedBossRaidTimeException = require('./exception/ExcedBossRaidTimeException')

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
  return dto.getStartBossRaidInformation(result)
}

const endBossRaid = async (bossStateCache, raidRecord) => {
  if (!raidValidator.isValid(bossStateCache, raidRecord)) {
    throw new NotValidBossRaidRecordException()
  }
  if (raidValidator.isExcedTime(bossStateCache.data)) {
    throw new ExcedBossRaidTimeException()
  }
  const result = await bossRepository.updateRaidRecord(bossStateCache.data)
  dto.setCache(bossStateCache, undefined)
  return result
}

const getUserRaidRecordAndTotalScore = async userId => {
  const result = await bossRepository.findAllUserRecord(userId)
  return result
}

const getRankers = async userId => {
  const result = await bossRepository.findRanker()
  return dto.splitToUserRankingAndAllRanking(result, userId)
}

module.exports = {
  getBossState,
  startBossRaid,
  endBossRaid,
  getUserRaidRecordAndTotalScore,
  getRankers,
}
