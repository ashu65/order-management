var _ = require('lodash');
var connectionPoolInterface = require('./MysqlConnectionPool').ConnectionPoolInterface;
var pool = connectionPoolInterface.getPool();
var constants = require('../../utils/Constants');
var QueryUtils = require('./QueryUtils');
var Utils = require('../../utils/Utils');


class MysqlReadWriteUtils {

    static _executeSqlQuery(connection, queryString) {
        return new Promise((resolve, reject) => {
            if(!connection) {
                console.log("connection not available");
                return reject(new Error("Connection Unavailable"))
            }
            connection.query(queryString, function (err, response) {
                if(err) {
                    console.log("Failed to run query!!");
                    return reject(err);
                } else{
                    return resolve(response);
                }

            });
        })
    }

    static getConnection() {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if(err) {
                    console.log("Failed to get Connection", err);
                    return reject(err);
                } else {
                    return resolve(connection);
                }
            })
        })
    }

    static _commitTransaction(connection, logString) {
        return new Promise((resolve, reject) => {
            if (!connection) {
                return reject(new Error("connection is null"));
            }
            connection.commit(function (err) {
                if (err) {
                    console.error(logString + "Failed to commit the transaction ", err);
                    return connection.rollback(function () {
                        MysqlReadWriteUtils._releaseConnectionCarefully(connection, logString);
                        return reject(err);
                    });
                }
                MysqlReadWriteUtils._releaseConnectionCarefully(connection, logString);
                return resolve();
            });
        })
    }

    static _rollbackTransaction(connection, logString) {
        return new Promise((resolve, reject) => {
            if (!connection) {
                return reject(new Error("connection is null"));
            }
            return connection.rollback(function () {
                MysqlReadWriteUtils._releaseConnectionCarefully(connection, logString);
                return resolve();
            });
        })
    }

    static _releaseConnectionCarefully(connection, logString) {
        try {
            connection.release();
            console.log(logString + "Connection released successfully");
        } catch (err) {
            console.error(logString + "Unhandled exception occurred in releasing the connection", err, err.message);
        }

    }

    static getProductCountsFromInventory(connection, productCodes) {
        return new Promise((resolve, reject) => {
            var queryString = QueryUtils.getselectProductCountsFromInventory(productCodes);
            connection.query(queryString, function (err, results) {
                if (err) {
                    MysqlReadWriteUtils._releaseConnectionCarefully(connection);
                    return reject(err);
                } else {
                    return resolve(results);
                }
            });
        })
    }

    static updateProductCountsInInventory(connection, productCountMap) {
        return new Promise((resolve, reject) => {
            var promises = [];
            _.each(productCountMap, function (count, productId) {
                var updateQuery = QueryUtils.getUpdateProductCountInInventory(productId, count);
                promises.push(MysqlReadWriteUtils._executeSqlQuery(connection, updateQuery));
            })
            Promise.all(promises).then(results => {
                MysqlReadWriteUtils._commitTransaction(connection).then(response => {
                    return resolve();
                }).catch(err => {
                    console.log("Failed to commit updates", err);
                    return reject(err);
                })
            }).catch(function (err) {
                console.log("Failed to update all product counts", err);
                MysqlReadWriteUtils._rollbackTransaction(connection).then(response => {
                    return reject(err)
                })
            })
        })
    }

}

module.exports = MysqlReadWriteUtils;
