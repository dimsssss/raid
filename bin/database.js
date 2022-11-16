'use strict'
/* global process, __filename */

require('dotenv').config()

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const config = require('../config/config')
const dataLocations = [
  `${process.cwd()}/src/user/domain/data`,
  `${process.cwd()}/src/boss/domain/data`,
]
const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  )
}

dataLocations.forEach(dataLocation => {
  fs.readdirSync(dataLocation)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
      )
    })
    .forEach(file => {
      const model = require(path.join(dataLocation, file))(
        sequelize,
        Sequelize.DataTypes,
      )
      db[model.name] = model
    })
})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
