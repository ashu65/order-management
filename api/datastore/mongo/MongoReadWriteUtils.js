var _ = require('lodash');
var orderModel= require('./schema/order');


class MongoReadWriteUtils {
    static createNewOrderRecord(orderData) {
        return new Promise((resolve, reject) => {
            var order = new orderModel(orderData);
            order.save(function (err, orderrecord) {
                if(err) {
                    console.log('Failed to create new order!!');
                    return reject(err);
                } else {
                    console.log('Created new order successfully!!');
                    return resolve(orderrecord);
                }
            })
        })
    }
}

module.exports = MongoReadWriteUtils;
