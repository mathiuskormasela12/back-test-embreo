// ========== Event Routes
// import all modules
const express = require('express')

// import all controllers
const eventController = require('../controllers/event')

// import all middlewares
const authMiddleware = require('../middlewares/auth')
const eventMiddleware = require('../middlewares/event')

// init router
const router = express.Router()

router.post('/event', authMiddleware.isCompany, eventMiddleware.checkCreateEventForm, eventController.createEvent)

module.exports = router
