'use strict';

var mysqlConfig = require('../../../config/config').mysql_config;
var mysql = require('mysql');
var pool = null;
pool = mysql.createPool({
    connectionLimit: mysqlConfig["connection-limit"],
    host: mysqlConfig["host"],
    user: mysqlConfig["username"],
    password: mysqlConfig["password"],
    database: mysqlConfig["database"],
    port: mysqlConfig["port"],
    connectTimeout: 100000,
    acquireTimeout: 100000
});


pool.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err;
    console.log('Connection pool is up ', rows[0]);
});


function getPool() {
    return pool;
}


module.exports.ConnectionPoolInterface = {
    getPool: getPool
};
