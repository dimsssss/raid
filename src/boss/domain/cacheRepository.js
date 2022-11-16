const {redis} = require('../../../bin/redis')

const saveRanking = async (ranking, userId) => {
  try {
    await redis
      .multi()
      .set('ranking', JSON.stringify(ranking.topRankerInfoList))
      .set(`userId:${userId}`, JSON.stringify(ranking.myRankingInfo))
      .exec()
  } catch (err) {
    throw new Error()
  }
}

const getRanking = async userId => {
  try {
    const result = await redis
      .multi()
      .get('ranking')
      .get(`userId:${userId}`)
      .exec()
    return result
  } catch (err) {
    throw new Error()
  }
}

module.exports = {
  saveRanking,
  getRanking,
}
