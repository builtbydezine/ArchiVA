// establish Mysql Connection  
const config = require('./security')
const mysql = require('mysql');

function dbConnect() {

  this.pool = null;

  // Init MySql Connection Pool  
  this.init = function () {
    this.pool = mysql.createPool({
      connectionLimit: config.db.connectionLimit,
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database
    });
  };

  // acquire connection and execute query on callbacks  
  this.acquire = function (callback) {

    this.pool.getConnection(function (err, connection) {
      callback(err, connection);
    });

  };

}

module.exports = new dbConnect();  