// =========== Auth Controllers
// import all modules
const response = require('../helpers/response')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
const users = require('../models/User')

exports.register = async (req, res) => {
  const {
    name,
    username,
    password,
    role
  } = req.body
  try {
    const isExist = await users.findAll({
      username: username
    })

    if (isExist.length > 0) {
      return response(req, res, 400, false, 'Username already in used')
    } else {
      try {
        const data = {
          name,
          username,
          password: (await bcrypt.hash(password, 8)),
          role
        }
        const results = await users.create(data)
        return response(req, res, 200, true, 'Successfully to create new user', results)
      } catch (err) {
        return response(req, res, 500, false, err.message)
      }
    }
  } catch (err) {
    return response(req, res, 500, false, err.message)
  }
}

exports.login = async (req, res) => {
  const {
    username,
    password
  } = req.body
  try {
    const isExist = await users.findAll({
      username: username
    })

    if (isExist.length < 1 || !(await bcrypt.compare(password, isExist[0].password))) {
      return response(req, res, 400, false, 'Wrong username or password')
    } else {
      const token = jwt.sign({
        id: isExist[0].id,
        role: isExist[0].role,
        username: isExist[0].username
      }, config.secret_key, {
        expiresIn: '24h'
      })

      return response(req, res, 200, true, 'Login successfully', { token })
    }
  } catch (err) {
    return response(req, res, 500, false, err.message)
  }
}
