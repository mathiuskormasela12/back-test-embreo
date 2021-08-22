// =========== Auth Controllers
// import all modules
const response = require('../helpers/response')

exports.register = (req, res) => {
  return response(req, res, 200, true, 'Hello API')
}
