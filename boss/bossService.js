const dto = require('./dto/raidRecord')
const bossRepository = require('./bossRepository')
const raidValidator = require('./RaidValidator')

const NotValidBossRaidRecordException = require('./exception/NotValidBossRaidRecordException')
const ExcedBossRaidTimeException = require('./exception/ExcedBossRaidTimeException')
const StartBossRaidException = require('./exception/StartBossRaidException')
const NotFoundRankingException = require('./exception/NotFoundRankingException')

const getBossState = bossRaidCache => {
  if (raidValidator.isRaiding(bossRaidCache.data)) {
    return dto.getImpossibleRaidState(bossRaidCache)
  }
  return dto.getPossibleRaidState()
}

const startBossRaid = async (bossRaidCache, requestRaids) => {
  if (raidValidator.isRaiding(bossRaidCache.data)) {
    throw new StartBossRaidException(requestRaids.userId)
  }

  const newRecord = dto.crateNewRaidBossRecord(
    bossRaidCache.bossState,
    requestRaids,
  )
  const result = await bossRepository.createBossRaidRecord(newRecord)
  dto.setBossStateCache(bossRaidCache, result)
  return dto.getStartBossRaidInformation(result)
}

const endBossRaid = async (bossRaidCache, raidRecord) => {
  if (!raidValidator.isValid(bossRaidCache, raidRecord)) {
    throw new NotValidBossRaidRecordException(raidRecord.userId)
  }
  if (raidValidator.isExcedTime(bossRaidCache.data)) {
    throw new ExcedBossRaidTimeException()
  }
  const result = await bossRepository.updateRaidRecord(bossRaidCache.data)
  const rankRecord = await bossRepository.findRanker()
  dto.setBossStateCache(bossRaidCache, undefined)
  dto.setBossRaidRankCache(bossRaidCache, rankRecord)
  return result
}

const getUserRaidRecordAndTotalScore = async userId => {
  const result = await bossRepository.findAllUserRecord(userId)
  return result
}

const getRankers = async (bossRaidCache, userId) => {
  if (
    !Object.hasOwn(bossRaidCache, 'ranking') ||
    bossRaidCache.ranking === undefined
  ) {
    throw new NotFoundRankingException()
  }

  return dto.splitToUserRankingAndAllRanking(bossRaidCache.ranking, userId)
}

module.exports = {
  getBossState,
  startBossRaid,
  endBossRaid,
  getUserRaidRecordAndTotalScore,
  getRankers,
}
