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
      const { insertId, affectedRows } = await dateEvents.buklCreate(req.body.date_event)

      const dateEventsId = [...Array(affectedRows)].map((item, index) => insertId + index)

      try {
        const data = {
          event_name: req.body.event_name,
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
        status: 'rejected',
        rejection_reason: reason
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
}

exports.approveEvent = async (req, res) => {
  const { id } = req.params

  try {
    const isExist = await events.findAll({ id, date_event: req.body.date_event }, 'AND')

    if (isExist.length < 1) {
      return response(req, res, 400, false, 'Unknown event')
    }

    try {
      await events.update({
        date_event: req.body.date_event,
        id
      }, 'AND', {
        status: 'approve'
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

      try {
        const dateEvent = await events.findDateEvent({
          'e.company_id': results[0].company_id,
          'e.vendor_id': results[0].vendor_id
        }, 'AND')

        const modifiedResults = results.map(item => ({
          ...item,
          id: undefined,
          status: undefined,
          comfirmed_date: moment(item.comfirmed_date).format('DD MMMM YYYY'),
          date_event: dateEvent.map(date => ({
            id_event: date.id_event,
            id_date_event: date.id_date_event,
            date: moment(date.date).format('DD MMMM YYYY'),
            status: date.status
          })),
          date_created: moment(item.date_created).format('DD MMMM YYYY')
        }))

        return response(req, res, 200, true, 'Sucessfully to get all events', modifiedResults[0])
      } catch (err) {
        console.log(err)
        return response(req, res, 500, false, err.message)
      }
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

      try {
        const dateEvent = await events.findDateEvent({
          'e.company_id': results[0].company_id,
          'e.vendor_id': results[0].vendor_id
        }, 'AND')

        const modifiedResults = results.map(item => ({
          ...item,
          id: undefined,
          status: undefined,
          comfirmed_date: moment(item.comfirmed_date).format('DD MMMM YYYY'),
          date_event: dateEvent.map(date => ({
            id_event: date.id_event,
            id_date_event: date.id_date_event,
            date: moment(date.date).format('DD MMMM YYYY'),
            status: date.status
          })),
          date_created: moment(item.date_created).format('DD MMMM YYYY')
        }))

        return response(req, res, 200, true, 'Sucessfully to get all events', modifiedResults[0])
      } catch (err) {
        console.log(err)
        return response(req, res, 500, false, err.message)
      }
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

    try {
      const dateEvent = await events.findDateEvent({
        'e.company_id': results[0].company_id,
        'e.vendor_id': results[0].vendor_id
      }, 'AND')

      const modifiedResults = results.map(item => ({
        ...item,
        id: undefined,
        status: undefined,
        comfirmed_date: moment(item.comfirmed_date).format('DD MMMM YYYY'),
        date_event: dateEvent.map(date => ({
          id_event: date.id_event,
          id_date_event: date.id_date_event,
          date: moment(date.date).format('DD MMMM YYYY'),
          status: date.status
        })),
        date_created: moment(item.date_created).format('DD MMMM YYYY')
      }))

      return response(req, res, 200, true, 'Sucessfully to get all events', modifiedResults[0])
    } catch (err) {
      console.log(err)
      return response(req, res, 500, false, err.message)
    }
  } catch (err) {
    console.log(err)
    return response(req, res, 500, false, err.message)
  }
}