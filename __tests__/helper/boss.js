require('dotenv').config()

const db = require('../../bin/database')

const cleanDatabase = async () => {
  try {
    const {raidRecords} = db
    await raidRecords.destroy({where: {}, force: true, truncate: true})
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  cleanDatabase,
}
