// ========== Database
// import all modules
const mysql = require('mysql2')
const config = require('../config')

class Database {
  constructor () {
    this.database = mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      multipleStatements: true
    })
    this.connect()
  }

  async sync () {
    try {
      const message = await this.createDatabase()
      console.log(message)
      try {
        const message = await this.createTables()
        console.log(message)
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
    }
  }

  createDatabase () {
    const sql = `CREATE DATABASE IF NOT EXISTS ${config.database.database} CHARACTER SET utf8 COLLATE utf8_general_ci;`

    return new Promise((resolve, reject) => {
      this.database.query(sql, (err) => {
        if (err) {
          return reject(err)
        } else {
          this.database = mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            database: config.database.database,
            multipleStatements: true
          })
          return resolve('Database has been created')
        }
      })
    })
  }

  createTables () {
    const sql = `
                  CREATE TABLE IF NOT EXISTS users (
                     id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
                     name varchar(255) NOT NULL,
                     username varchar(255) NOT NULL UNIQUE,
                     password varchar(255) NOT NULL,
                     role BOOLEAN NOT NULL,
                     created_at timestamp DEFAULT CURRENT_TIMESTAMP,
                     updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                  );

                  CREATE TABLE IF NOT EXISTS date_events (
                     id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
                     date Date NOT NULL,
                     created_at timestamp DEFAULT CURRENT_TIMESTAMP,
                     updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                  );

                  CREATE TABLE IF NOT EXISTS events (
                     id int AUTO_INCREMENT NOT NULL PRIMARY KEY,
                     company_id int NOT NULL,
                     vendor_id int NOT NULL,
                     date_event int NOT NULL,
                     status varchar(100) NOT NULL,
                     rejection_reason TEXT,
                     created_at timestamp DEFAULT CURRENT_TIMESTAMP,
                     updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                     FOREIGN KEY (date_event) REFERENCES date_events(id),
                     FOREIGN KEY (vendor_id) REFERENCES users(id),
                     FOREIGN KEY (company_id) REFERENCES users(id)
                  );
                `

    return new Promise((resolve, reject) => {
      this.database.query(sql, (err) => {
        if (err) {
          return reject(err)
        } else {
          return resolve('The tables has been created')
        }
      })
    })
  }

  connect () {
    this.database.connect(err => {
      if (err) {
        console.log(err)
      } else {
        console.log('Database has been connected')
      }
    })
  }
}

module.exports = Database
