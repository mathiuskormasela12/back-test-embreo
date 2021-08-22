// ========== Event Controller
// import all modules
const response = require('../helpers/response')
const events = require('../models/Event')
const dateEvents = require('../models/DateEvent')
const users = require('../models/User')

exports.createEvent = async (req, res) => {
  try {
    const isVendorExists = await users.findAll({
      id: req.body.vendor_id
    })

    if (isVendorExists.length < 1) {
      return response(req, res, 400, false, 'Unkown vendor')
    }

    try {
      const { insertId, affectedRows } = await dateEvents.buklCreate(req.body.date_event)

      const dateEventsId = [...Array(affectedRows)].map((item, index) => insertId + index)

      try {
        const data = {
          vendor_id: req.body.vendor_id,
          company_id: req.data.id,
          date_event: dateEventsId,
          status: 'pending'
        }
        await events.buklCreate(data)
        return response(req, res, 200, true, 'Successfully create new event')
      } catch (err) {
        console.log(err)
        return response(req, res, 500, false, err.message)
      }
    } catch (err) {
      console.log(err)
      return response(req, res, 500, false, err.message)
    }
  } catch (err) {
    console.log(err)
    return response(req, res, 500, false, err.message)
  }
}
