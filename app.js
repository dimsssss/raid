/* global process */

require('dotenv').config()

const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const userRouter = require('./user/index')
const bossRouter = require('./boss/index')

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const app = express()

app.set('bossRaidCache', {})

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(logger('dev'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use('/user', userRouter)
app.use('/bossRaid', bossRouter)

module.exports = app
