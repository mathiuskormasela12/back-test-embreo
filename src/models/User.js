// ========== User Model
// import all modules
const Database = require('../core/Database')

class User extends Database {
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
            ...data,
            password: undefined
          })
        }
      })
    })
  }
}

module.exports = new User('users')
