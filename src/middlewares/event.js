// ========== Event Middleware
// import all modules
const { body, validationResult } = require('express-validator')
const response = require('../helpers/response')

exports.checkCreateEventForm = [
  body('event_name', "event_name can't be empty")
    .notEmpty(),
  body('vendor_id', "vendor_id can't be empty")
    .notEmpty(),
  body('date_event', "date_event can't be empty")
    .notEmpty(),
  body('location', "location can't be empty")
    .notEmpty(),
  body('date_event', 'You must select 3 proposed dates')
    .isArray({
      min: 3,
      max: 3
    }),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return response(req, res, 400, false, errors.array()[0].msg)
    }

    return next()
  }
]

exports.checkRejectEventForm = [
  body('reason', "The reason can't be empty")
    .notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return response(req, res, 400, false, errors.array()[0].msg)
    }

    return next()
  }
]

exports.checkApproveEventForm = [
  body('date_event', "The date_event can't be empty")
    .notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return response(req, res, 400, false, errors.array()[0].msg)
    }

    return next()
  }
]
