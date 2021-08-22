// ========== Auth Routes
// import all modules
const express = require('express')

// import all controllers
const authController = require('../controllers/auth')

// init router
const router = express.Router()

router.post('/auth/register', authController.register)

module.exports = router
