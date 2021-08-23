// ========== Event Model
// import all modules
const Database = require('../core/Database')

class Event extends Database {
  constructor (table) {
    super()
    this.table = table
  }

  findAllWithRelation (conditions, operator = '') {
    const sql = `
                  SELECT
                  e.id,
                  e.vendor_id,
                  e.company_id,
                  e.event_name,
                  e.location,
                  v.name as vendor_name,
                  e.updated_at as comfirmed_date,
                  e.created_at as date_created
                  FROM ${this.table} e 
                  INNER JOIN users c ON c.id = e.company_id
                  INNER JOIN users v ON v.id = e.vendor_id
                  INNER JOIN date_events de on de.id_event = e.id
                  ${conditions ? `WHERE ${Object.keys(conditions).map((item, index) => `${item} = '${Object.values(conditions)[index]}'`).join(` ${operator} `)}` : ''}
                  GROUP BY e.id;
                `

    return new Promise((resolve, reject) => {
      this.getDatabase().query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(results)
        }
      })
    })
  }

  findAll (conditions, operator = '') {
    const sql = `
                  SELECT * FROM ${this.table} 
                  ${conditions && `WHERE ${Object.keys(conditions).map((item, index) => `${item} = '${Object.values(conditions)[index]}'`).join(` ${operator} `)}`}
                `

    return new Promise((resolve, reject) => {
      this.getDatabase().query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(results)
        }
      })
    })
  }

  findDateEvent (conditions, operator = '') {
    const sql = `
                  SELECT 
                  e.id AS id_event, 
                  de.id AS id_date_event,
                  e.location, 
                  de.date,
                  de.status
                  FROM ${this.table} e
                  INNER JOIN date_events de on de.id_event = e.id
                  ${conditions && `WHERE ${Object.keys(conditions).map((item, index) => `${item} = '${Object.values(conditions)[index]}'`).join(` ${operator} `)}`}
                `

    return new Promise((resolve, reject) => {
      this.getDatabase().query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(results)
        }
      })
    })
  }

  create (data) {
    const sql = `INSERT INTO ${this.table} SET ?`

    return new Promise((resolve, reject) => {
      this.getDatabase().query(sql, data, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve({
            id: results.insertId,
            ...data
          })
        }
      })
    })
  }

  buklCreate (data) {
    const sql = `INSERT INTO ${this.table}(${Object.keys(data).map(item => item).join(', ')}) VALUES${data.date_event.map((item, index) => `(${Object.values(data).map(item => `'${Array.isArray(item) ? item[index] : item}'`)})`)}`

    return new Promise((resolve, reject) => {
      this.getDatabase().query(sql, data, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(true)
        }
      })
    })
  }

  update (condition, operator, data) {
    const sql = `UPDATE ${this.table} SET ? ${condition && `WHERE ${Object.keys(condition).map((item, index) => `${item} = '${Object.values(condition)[index]}'`).join(` ${operator} `)}`}`

    return new Promise((resolve, reject) => {
      this.getDatabase().query(sql, data, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(true)
        }
      })
    })
  }
}

module.exports = new Event('events')
