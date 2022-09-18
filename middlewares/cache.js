const bossRepository = require('../boss/bossRepository')
const dto = require('../boss/dto/raidRecord')

const getRaidRecord = async () => {
  try {
    return await bossRepository.findLatestRaidRecord()
  } catch (err) {
    throw new Error()
  }
}

const initRaidRecord = async bossRaidCache => {
  const [cacheRecord, cachedRanking] = await getRaidRecord()

  if (cacheRecord) {
    bossRaidCache.data = cacheRecord
  }
  if (cachedRanking) {
    const topRankerInfoList = dto.splitToUserRankingAndAllRanking(cachedRanking)

    bossRaidCache.ranking = {
      topRankerInfoList,
    }
  }
}

module.exports = initRaidRecord
