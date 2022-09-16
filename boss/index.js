const express = require('express')
const router = express.Router()
const bossController = require('./bossController')

router.get('/', bossController.getBossState)

module.exports = router
