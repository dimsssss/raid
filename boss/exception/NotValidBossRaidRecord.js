class NotValidBossRaidRecord extends Error {
  constructor() {
    super()
    this.message = '유효한 boss Raid 기록이 아닙니다'
  }
}

module.exports = NotValidBossRaidRecord
