const userRepository = require('./userRepository')

const signUp = async () => {
  return await userRepository.createUser()
}

module.exports = {
  signUp,
}
