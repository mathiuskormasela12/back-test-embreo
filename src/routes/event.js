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
router.patch('/event/reject/:id', authMiddleware.isVendor, eventMiddleware.checkRejectEventForm, eventController.rejectEvent)
router.patch('/event/approve/:id', authMiddleware.isVendor, eventMiddleware.checkApproveEventForm, eventController.approveEvent)
router.get('/event', authMiddleware.isLogin, eventController.getAllEvent)
router.get('/event/:id', authMiddleware.isLogin, eventController.getAllEventDetail)

module.exports = router
