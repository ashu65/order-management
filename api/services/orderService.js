const _ = require('lodash');
const uuid = require('node-uuid');
const mysqlReadWriteUtils = require('../datastore/mysql/MysqlReadWriteUtils');
const mongoReadWriteUtils = require('../datastore/mongo/MongoReadWriteUtils');
const orderHelper = require('../helpers/OrderHelper');
const constants = require('../utils/Constants');

class OrderService {
    static createNewOrder(orderContext) {

        var orderItems = _.get(orderContext, 'items');
        var productCountMap = {}
        _.each(orderItems, function (orderItem) {
            productCountMap[orderItem.product_code] = orderItem.quantity;
        })

        return new Promise((resolve, reject) => {
            mysqlReadWriteUtils.getConnection().then(newConnection => {
                mysqlReadWriteUtils.getProductCountsFromInventory(newConnection, _.keys(productCountMap)).then(productCountResults => {
                    //Validate if the inventory still has sufficient counts for each product
                    var countValidationData = orderHelper.validateOrderCountWithInventoryCount(productCountResults, productCountMap);

                    if(_.get(countValidationData, 'lacking_products', []).length > 0) {
                        // We can chose to ignore send a response back to user for order correction as some products dont exist with enough quantity.
                        // Continuing for now assuming everything was available.
                    }

                    mysqlReadWriteUtils.updateProductCountsInInventory(newConnection, productCountMap).then(inventoryUpdateResult => {
                        var orderRecordMongo = {
                            order_address: orderContext.address,
                            order_id: uuid.v4(),
                            date: new Date(),
                            account_id: orderContext.account_id,
                            items: orderContext.items,
                            payment_status: orderContext.payment_status,
                            payment_mode: orderContext.payment_mode,
                            order_status: constants.ORDER_STATUS.PLACED,
                        }
                        mongoReadWriteUtils.createNewOrderRecord(orderRecordMongo).then(newOrder => {
                            return resolve(newOrder);
                        }).catch(err => {
                            console.log('Failed to create new order in mongo', err);
                            return reject(err);
                        })
                    }).catch(err => {
                        console.log('Failed to update inventory count', err);
                        return reject(err);
                    })
                })
            })
        })

    }

    static getOneOrder(orderId) {

    }
}

module.exports = OrderService;
