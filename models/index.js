const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const initModels = require('./init-models')

const models = initModels(sequelize)

if (models.users) {
  Object.defineProperty(models.users.prototype, 'avatarUrl', {
    get() {
      const rawValue = this.getDataValue('avatarUrl')
      return rawValue ? `https://your-domain.com/images/${rawValue}` : null
    },
  })
}

module.exports = models
