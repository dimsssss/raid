const userRepository = require('./domain/userRepository')

const signUp = async () => {
  return await userRepository.createUser()
}

module.exports = {
  signUp,
}
