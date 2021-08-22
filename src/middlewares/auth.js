// ========== Auth Middleware
// import all modules
const { body, validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('../config')
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

exports.isCompany = (req, res, next) => {
  const token = req.headers.authorization

  if (token) {
    jwt.verify(token, config.secret_key, (err, decode) => {
      if (err) {
        return response(req, res, 400, false, err.message)
      } else {
        if (decode.role === 1) {
          req.data = decode
          return next()
        } else {
          return response(req, res, 403, false, 'Forbidden')
        }
      }
    })
  } else {
    return response(req, res, 403, false, 'Forbidden')
  }
}

exports.isVendor = (req, res, next) => {
  const token = req.headers.authorization

  if (token) {
    jwt.verify(token, config.secret_key, (err, decode) => {
      if (err) {
        return response(req, res, 400, false, err.message)
      } else {
        if (decode.role === 0) {
          req.data = decode
          return next()
        } else {
          return response(req, res, 403, false, 'Forbidden')
        }
      }
    })
  } else {
    return response(req, res, 403, false, 'Forbidden')
  }
}

exports.isLogin = (req, res, next) => {
  const token = req.headers.authorization

  if (token) {
    jwt.verify(token, config.secret_key, (err, decode) => {
      if (err) {
        return response(req, res, 400, false, err.message)
      } else {
        req.data = decode
        return next()
      }
    })
  } else {
    return response(req, res, 403, false, 'Forbidden')
  }
}
