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

module.exports = {
  getBossState,
}