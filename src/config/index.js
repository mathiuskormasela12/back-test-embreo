// ========== Server Configurations
// import all modules
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  app_url: process.env.APP_URL,
  port: process.env.PORT || 3000,
  secret_key: process.env.SECRET_KEY,
  whitelist: [
    'http://localhost:3000'
  ],
  database: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
}
