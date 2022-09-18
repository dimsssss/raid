const dto = require('./dto/raidRecord')
const bossRepository = require('./bossRepository')
const raidValidator = require('./RaidValidator')
const NotValidBossRaidRecordException = require('./exception/NotValidBossRaidRecordException')
const ExcedBossRaidTimeException = require('./exception/ExcedBossRaidTimeException')

const getBossState = bossRaidCache => {
  return dto.getBossState(bossRaidCache)
}

const startBossRaid = async (bossRaidCache, requestRaids) => {
  const newRecord = dto.crateNewRaidBossRecord(
    bossRaidCache.bossRaids,
    requestRaids,
  )
  const result = await bossRepository.createBossRaidRecord(newRecord)
  dto.setCache(bossRaidCache, result)
  return dto.getStartBossRaidInformation(result)
}

const endBossRaid = async (bossRaidCache, raidRecord) => {
  if (!raidValidator.isValid(bossRaidCache, raidRecord)) {
    throw new NotValidBossRaidRecordException()
  }
  if (raidValidator.isExcedTime(bossRaidCache.data)) {
    throw new ExcedBossRaidTimeException()
  }
  const result = await bossRepository.updateRaidRecord(bossRaidCache.data)
  // const cache = await bossRepository.findRanker()
  dto.setCache(bossRaidCache, undefined)
  return result
}

const getUserRaidRecordAndTotalScore = async userId => {
  const result = await bossRepository.findAllUserRecord(userId)
  return result
}

const getRankers = async (bossRaidCache, userId) => {
  const ranking = bossRaidCache.ranking
  return dto.splitToUserRankingAndAllRanking(ranking, userId)
}

module.exports = {
  getBossState,
  startBossRaid,
  endBossRaid,
  getUserRaidRecordAndTotalScore,
  getRankers,
}
