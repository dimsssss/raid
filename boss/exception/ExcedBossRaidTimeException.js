class ExcedBossRaidTimeException extends Error {
  constructor() {
    super()
    this.message = 'boss raid 시간을 초과하였습니다'
  }
}

module.exports = ExcedBossRaidTimeException
