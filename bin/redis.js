/* global process */
require('dotenv').config()

const {createClient} = require('redis')
const redis = createClient({
  socket: {
    port: Number(process.env.REDIS_PORT),
  },
})

function init() {
  return new Promise((resolve, rejects) => {
    redis.on('error', err => {
      rejects(err)
    })
    redis.connect()
    resolve(redis)
  })
}

module.exports = {
  init,
  redis,
}
