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

  const limitTime = getLimitTime(record.createdAt)

  if (record.state === 'start' && Date.now() >= limitTime) {
    return false
  }

  return true
}

const getLimitTime = createdAt => {
  const datetime = new Date(createdAt)
  datetime.setMinutes(datetime.getMinutes() + 3)
  return datetime
}

const isValid = (bossRaidCache, userRaidRecord) => {
  const cachedRaidRecordId = bossRaidCache.data.raidRecordId
  const cachedUserId = bossRaidCache.data.userId
  if (
    cachedRaidRecordId === userRaidRecord.raidRecordId &&
    cachedUserId === userRaidRecord.userId
  ) {
    return true
  }
  return false
}

const isExcedTime = record => {
  const raidStartDate = new Date(record.createdAt)
  raidStartDate.setMinutes(raidStartDate.getMinutes() + 3)

  if (record.state === 'start' && Date.now() >= raidStartDate) {
    return true
  }
  return false
}

const hasRankingData = bossRaidCache => {
  const NotFoundRankingException = require('./exception/NotFoundRankingException')

  if (
    !Object.hasOwn(bossRaidCache, 'ranking') ||
    bossRaidCache.ranking === undefined ||
    !Array.isArray(bossRaidCache.ranking.topRankerInfoList) ||
    bossRaidCache.ranking.topRankerInfoList.length === 0
  ) {
    throw new NotFoundRankingException()
  }
}

const hasLatestRaidRecord = bossRaidCache => {
  if (
    !Object.hasOwn(bossRaidCache, 'data') ||
    bossRaidCache.data === undefined
  ) {
    return false
  }
  return true
}

module.exports = {
  isValid,
  isRaiding,
  isExcedTime,
  hasRankingData,
  hasLatestRaidRecord,
}
