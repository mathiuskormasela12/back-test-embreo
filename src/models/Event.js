// ========== Event Model
// import all modules
const Database = require('../core/Database')

class Event extends Database {
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
