const express = require('express')
const router = express.Router()
const bossController = require('./presentation/bossController')
const {postValidator, patchValidator} = require('./presentation/bossValidator')

router.get('/topRankerList', bossController.getRankings)
router.post('/enter', postValidator, bossController.enterBossRaid)
router.patch('/end', patchValidator, bossController.finishBossRaid)
router.get('/', bossController.getBossState)

module.exports = router
