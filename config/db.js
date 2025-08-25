const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
)

const checkConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log('Kết nối đến cơ sở dữ liệu thành công.')
  } catch (error) {
    console.error('Không thể kết nối đến cơ sở dữ liệu:', error)
  }
}

checkConnection()

module.exports = sequelize
