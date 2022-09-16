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

const isValid = (bossStateCache, requestRaids) => {
  const cachedRaidRecordId = bossStateCache.data.raidRecordId
  const cachedUserId = bossStateCache.data.userId
  if (
    cachedRaidRecordId === requestRaids.raidRecordId &&
    cachedUserId === requestRaids.userId
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

module.exports = {
  isValid,
  isRaiding,
  isExcedTime,
}
