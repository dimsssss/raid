const express = require('express')
const router = express.Router()
const userController = require('./presentation/userController')
const {getValidator} = require('./presentation/userValidator')

router.get('/:userId', getValidator, userController.getUserRaidRecords)
router.post('/', userController.createUser)

module.exports = router
