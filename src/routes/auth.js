// ========== Auth Routes
// import all modules
const express = require('express')

// import all controllers
const authController = require('../controllers/auth')

// import all middlewares
const authMiddleware = require('../middlewares/auth')

// init router
const router = express.Router()

router.post('/auth/register', authMiddleware.checkRegisterForm, authController.register)
router.post('/auth/login', authMiddleware.checkLoginForm, authController.login)

module.exports = router
