require('dotenv').config()

const db = require('../../bin/database')
const {faker} = require('@faker-js/faker')

const createUserData = () => {
  const userDummy = []
  for (let i = 0; i < 10; i += 1) {
    const userName = faker.name.fullName()
    userDummy.push({userName})
  }
  return userDummy
}
const createDefaultData = async () => {
  try {
    const {users} = db
    const userData = createUserData()
    const result = await users.bulkCreate(userData, {raw: true})
    return result
  } catch (err) {
    throw new Error(err)
  }
}

const cleanDatabase = async () => {
  try {
    const {users} = db
    await users.destroy({where: {}, force: true, truncate: true})
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  createDefaultData,
  cleanDatabase,
}
