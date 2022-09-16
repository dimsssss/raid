const express = require('express')
const router = express.Router()
const bossController = require('./presentation/bossController')
const {postValidator, patchValidator} = require('./presentation/bossValidator')

router.get('/', bossController.getBossState)
router.post('/', postValidator, bossController.enterBossRaid)
router.patch('/', patchValidator, bossController.finishBossRaid)

module.exports = router
