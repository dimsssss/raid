const getScoreFor = (bossRaidInformation, level) => {
  const levelInformation = bossRaidInformation.levels.filter(information => {
    return level === information.level
  })
  return levelInformation[0].score
}

const crateNewRaidBossRecord = (bossRaidInformation, requestRaids) => {
  const score = getScoreFor(bossRaidInformation, requestRaids.level)
  return {
    userId: requestRaids.userId,
    state: 'start',
    score,
  }
}

const crateEndRaidBossRecord = (bossRaidInformation, requestRaids) => {
  const score = getScoreFor(bossRaidInformation, requestRaids.level)
  return {
    userId: requestRaids.userId,
    state: 'end',
    score,
  }
}

const getPossibleRaidState = () => {
  return {
    canEnter: true,
  }
}

const getImpossibleRaidState = cache => {
  return {
    canEnter: false,
    userId: cache.data.userId,
  }
}

const setBossStateCache = (bossRaidCache, result) => {
  bossRaidCache.data = result
}

const setBossRaidRankCache = (bossRaidCache, result) => {
  bossRaidCache.ranking = result
}

const getStartBossRaidInformation = record => {
  return {
    isEntered: record.state === 'start',
    raidRecordId: record.raidRecordId,
  }
}

const getUserRanking = (userId, records) => {
  if (!Object.hasOwn(records, 'topRankerInfoList')) {
    return records.filter(record => {
      return record.userId === userId
    })[0]
  }
  return records.topRankerInfoList.filter(record => {
    return record.userId === userId
  })[0]
}

const splitToUserRankingAndAllRanking = (records, userId) => {
  if (userId === undefined) {
    return records
  }
  const userRanking = getUserRanking(userId, records)
  const result = {}

  if (userRanking) {
    const myRankingInfo = Object.assign(userRanking)
    result.myRankingInfo = myRankingInfo
  }

  if (!Object.hasOwn(records, 'topRankerInfoList')) {
    result.topRankerInfoList = records
  } else {
    result.topRankerInfoList = records.topRankerInfoList
  }

  return result
}

module.exports = {
  getPossibleRaidState,
  getImpossibleRaidState,
  crateNewRaidBossRecord,
  setBossStateCache,
  getStartBossRaidInformation,
  crateEndRaidBossRecord,
  splitToUserRankingAndAllRanking,
  setBossRaidRankCache,
}
