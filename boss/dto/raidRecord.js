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

const splitToUserRankingAndAllRanking = (records, userId) => {
  const myRankingInfo = records.filter(record => {
    return record.userId === userId
  })[0]
  return {
    topRankerInfoList: records,
    myRankingInfo,
  }
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
