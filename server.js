// ========== Server
// import all modules
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')
const config = require('./src/config')
const Database = require('./src/core/Database')

// init app
const app = express()

// setup form url encoded & json
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// setup several middlewares
app.use(morgan('dev'))
app.use(compression())
app.use(helmet())

// setup cors
const corsOptions = {
  origin: function (origin, callback) {
    if (config.whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Blocked by cors'))
    }
  }
}

app.use(cors(corsOptions))

// synch database
const db = new Database()
db.sync()

app.use('/api/v1', require('./src/routes/auth'))

app.listen(config.port, () => {
  console.log(`Web services running at ${config.app_url}`)
})
