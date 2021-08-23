// ========== Date Event Model
// import all modules
const Database = require('../core/Database')

class DateEvent extends Database {
  constructor (table) {
    super()
    this.table = table
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
    const sql = `INSERT INTO ${this.table}(${Object.keys(data).map(field => `${field}`).join(', ')}) VALUES${data.date.map((item, index) => `(${(typeof (item) === 'object') ? `'${data.id_event}','${item[index]}', '${data.status}'` : `'${data.id_event}','${item}', '${data.status}'`})`).join(', ')}`

    return new Promise((resolve, reject) => {
      this.getDatabase().query(sql, data, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(results)
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

module.exports = new DateEvent('date_events')
