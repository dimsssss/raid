/**
 * 보스 레이드가 처음이거나, 시작하고 3분이 지났거나, 마지막 상태가 끝났을 경우 false
 * 그 외에 true
 * @param {*} record
 * @returns boolean
 */
const isRaiding = record => {
  if (record === undefined) {
    return false
  }

  if (record.state === 'end') {
    return false
  }

  const raidStartDate = new Date(record.createdAt)
  raidStartDate.setMinutes(raidStartDate.getMinutes() + 3)

  if (record.state === 'start' && Date.now() >= raidStartDate) {
    return false
  }

  return true
}

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

const getBossState = cache => {
  if (cache !== undefined && isRaiding(cache.data)) {
    return {
      canEnter: false,
      userId: cache.data.userId,
    }
  }
  return {
    canEnter: true,
  }
}

const setCache = (bossStateCache, result) => {
  bossStateCache.data = result
}

const getStartBossInformation = record => {
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
  getBossState,
  isRaiding,
  crateNewRaidBossRecord,
  setCache,
  getStartBossInformation,
  crateEndRaidBossRecord,
  splitToUserRankingAndAllRanking,
}
