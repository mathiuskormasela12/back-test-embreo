// ========== Event Controller
// import all modules
const moment = require('moment')
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
      const data = {
        event_name: req.body.event_name,
        vendor_id: req.body.vendor_id,
        company_id: req.data.id,
        location: req.body.location
      }

      const { id } = await events.create(data)
      const dateEventsData = {
        id_event: id,
        date: req.body.date_event,
        status: 'pending'
      }

      try {
        await dateEvents.buklCreate(dateEventsData)
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

exports.rejectEvent = async (req, res) => {
  const { reason } = req.body
  const { id } = req.params

  try {
    const isExist = await events.findAll({ id })

    if (isExist.length < 1) {
      return response(req, res, 400, false, 'Unknown event')
    }

    try {
      await events.update({ id }, '', {
        rejection_reason: reason
      })

      try {
        await dateEvents.update({ id_event: id }, '', {
          status: 'rejected'
        })
        return response(req, res, 200, true, 'The event was successfully rejected')
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

exports.approveEvent = async (req, res) => {
  const { id } = req.params

  try {
    const isExist = await events.findAllWithRelation({
      'e.id': id,
      'de.id': req.body.date_event
    }, 'AND')

    if (isExist.length < 1) {
      return response(req, res, 400, false, 'Unknown event')
    }

    try {
      await dateEvents.update({
        id: req.body.date_event,
        id_event: id
      }, 'AND', {
        status: 'approved'
      })

      return response(req, res, 200, true, 'The event was successfully approve')
    } catch (err) {
      console.log(err)
      return response(req, res, 500, false, err.message)
    }
  } catch (err) {
    console.log(err)
    return response(req, res, 500, false, err.message)
  }
}

exports.getAllEvent = async (req, res) => {
  if (Number(req.data.role) === 0) {
    try {
      const results = await events.findAllWithRelation({
        'v.id': req.data.id
      })

      if (results.length < 1) {
        return response(req, res, 400, false, 'no events available')
      }

      const modifiedResults = results.map(item => ({
        ...item,
        status: undefined,
        rejected_date: moment(item.rejected_date).format('DD MMMM YYYY'),
        date_event: item.date.split(',').map((date, index) => ({
          id_date_event: item.id_date_event.split(',')[index],
          date: moment(date).format('DD MMMM YYYY'),
          status: item.status.split(',')[index]
        })),
        date_created: moment(item.date_created).format('DD MMMM YYYY')
      }))

      return response(req, res, 200, true, 'Sucessfully to get all events', modifiedResults)
    } catch (err) {
      console.log(err)
      return response(req, res, 500, false, err.message)
    }
  } else {
    try {
      const results = await events.findAllWithRelation({
        'c.id': req.data.id
      })

      if (results.length < 1) {
        return response(req, res, 400, false, 'no events available')
      }

      const modifiedResults = results.map(item => ({
        ...item,
        status: undefined,
        rejected_date: moment(item.rejected_date).format('DD MMMM YYYY'),
        date_event: item.date.split(',').map((date, index) => ({
          id_date_event: item.id_date_event.split(',')[index],
          date: moment(date).format('DD MMMM YYYY'),
          status: item.status.split(',')[index]
        })),
        date_created: moment(item.date_created).format('DD MMMM YYYY')
      }))

      return response(req, res, 200, true, 'Sucessfully to get all events', modifiedResults)
    } catch (err) {
      console.log(err)
      return response(req, res, 500, false, err.message)
    }
  }
}

exports.getAllEventDetail = async (req, res) => {
  try {
    const results = await events.findAllWithRelation({
      'e.id': req.params.id
    }, '')

    if (results.length < 1) {
      return response(req, res, 400, false, 'no events available')
    }

    const modifiedResults = results.map(item => ({
      ...item,
      status: undefined,
      rejected_date: moment(item.rejected_date).format('DD MMMM YYYY'),
      date_event: item.date.split(',').map((date, index) => ({
        id_date_event: item.id_date_event.split(',')[index],
        date: moment(date).format('DD MMMM YYYY'),
        status: item.status.split(',')[index]
      })),
      date_created: moment(item.date_created).format('DD MMMM YYYY')
    }))

    return response(req, res, 200, true, 'Sucessfully to get all events', modifiedResults[0])
  } catch (err) {
    console.log(err)
    return response(req, res, 500, false, err.message)
  }
}
