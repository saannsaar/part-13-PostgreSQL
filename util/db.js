const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const logger = require('./logger')
const sequelize = new Sequelize(DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    logger.info('Connected to the database succesfully!')
  } catch (err) {
    logger.error('Failed to connect to the database!')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }