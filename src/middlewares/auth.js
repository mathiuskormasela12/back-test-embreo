// ========== Auth Middleware
// import all modules
const { body, validationResult } = require('express-validator')
const response = require('../helpers/response')

exports.checkRegisterForm = [
  body('name', "Name can't be empty")
    .notEmpty(),
  body('username', "Username can't be empty")
    .notEmpty(),
  body('password', "Password can't be empty")
    .notEmpty(),
  body('password', 'Your password is too weak')
    .isStrongPassword(),
  body('role', "Role can't be empty")
    .notEmpty(),
  body('role', 'Unknown role')
    .isInt({
      min: 0,
      max: 1
    }),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return response(req, res, 400, false, errors.array()[0].msg)
    }

    return next()
  }
]

exports.checkLoginForm = [
  body('username', "Username can't be empty")
    .notEmpty(),
  body('password', "Password can't be empty")
    .notEmpty(),
  body('password', 'Your password is too weak')
    .isStrongPassword(),
  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return response(req, res, 400, false, errors.array()[0].msg)
    }

    return next()
  }
]
