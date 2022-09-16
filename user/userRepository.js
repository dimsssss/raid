const db = require('../bin/database')

const getUser = async userId => {
  try {
    const {users} = db
    return await users.findByPk(userId, {raw: true})
  } catch (err) {
    throw new Error(err)
  }
}

const createUser = async () => {
  try {
    const {users} = db
    return await users.create({raw: true})
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  getUser,
  createUser,
}
