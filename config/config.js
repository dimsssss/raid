/* global process */
require('dotenv').config()

module.exports = {
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  dialect: process.env.DIALECT,
  timezone: process.env.TIMEZONE,
  pool: {
    min: Number(process.env.MIN),
    max: Number(process.env.MAX),
  },
}
