const BossRaidingException = require('../exception/BossRaidingException')
const getScoreFor = (bossRaidInformation, level) => {
  const levelInformation = bossRaidInformation.levels.filter(information => {
    return level === information.level
  })
  return levelInformation[0].score
}

const crateNewRaidBossRecord = (bossRaidInformation, requestRaids) => {
  standardizeRaidLevel(requestRaids)
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
  if (record === undefined) {
    throw new BossRaidingException()
  }
  return {
    isEntered: record.state === 'start',
    raidRecordId: record.raidRecordId,
  }
}

const standardizeRaidLevel = user => {
  user.level -= 1
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

const convertTo = rankings => {
  try {
    const topRankerInfoList = JSON.parse(rankings[0])
    const myRankingInfo = JSON.parse(rankings[1])
    return {topRankerInfoList, myRankingInfo}
  } catch (err) {
    throw new Error(err)
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
  standardizeRaidLevel,
  convertTo,
}
