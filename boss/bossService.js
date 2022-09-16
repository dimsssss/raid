const dto = require('./dto/bossState')

const getBossState = bossStateCache => {
  return dto.getBossState(bossStateCache)
}

module.exports = {
  getBossState,
}
