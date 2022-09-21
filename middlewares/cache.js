const bossRepository = require('../boss/infra/bossRepository')
const bossStateRepository = require('../boss/infra/bossStateRepository')
const dto = require('../boss/dto/raidRecord')

const getRaidRecord = async () => {
  try {
    return await bossRepository.findLatestRaidRecord()
  } catch (err) {
    throw new Error()
  }
}

const initRaidRecord = async (bossRaidCache, redis) => {
  const [cacheRecord, cachedRanking] = await getRaidRecord()
  await bossStateRepository.initBossState()

  if (cacheRecord) {
    bossRaidCache.data = cacheRecord
  }
  if (cachedRanking) {
    const topRankerInfoList = dto.splitToUserRankingAndAllRanking(cachedRanking)
    redis.set('ranking', JSON.stringify(topRankerInfoList))
    bossRaidCache.ranking = {
      topRankerInfoList,
    }
  }
}

module.exports = initRaidRecord
