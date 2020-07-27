var _ = require('lodash');
var Constants = require('../utils/Constants');
var Utils = require('../utils/Utils');

class OrderHelper {
    static validateCreateOrderPayload(reqBody) {
        return new Promise((resolve, reject) => {
            var validationObject = {
                isValid : false,
                message: ""
            };
            var accountId = _.get(reqBody, 'accountId'); //If its an authenticated request, this need not be there in payload and can be set in request in middleware as part of authentication.
            var paymentStatus = _.get(reqBody, 'payment_status');
            var paymentMode = _.get(reqBody, 'payment_mode');
            OrderHelper._validateAccount(accountId, validationObject).then( response => {
                if(_.get(validationObject, 'isValid')) {
                    OrderHelper._validatePayment(paymentStatus, paymentMode, validationObject);
                    if(_.get(validationObject, 'isValid') === false) {
                        return resolve(validationObject);
                    } else {
                        var orderItems = _.get(reqBody, 'items', []);
                        OrderHelper._validateOrderItems(orderItems, validationObject).then(updatedValidationObject => {
                            return resolve(updatedValidationObject);
                        });
                    }
                } else {
                    Utils.populateValidationObject(validationObject, false, "Invalid Account. Cant create Order");
                    return resolve(validationObject);
                }
            }).catch(err => {
                console.error('Failed to validate order', err);
                return reject(err);
            })
        })
    }

    static _validatePayment(paymentStatus, paymentMode, validationObject) {
        if(paymentStatus && paymentMode) {
            if (_.includes([Constants.PAYMENT_METHOD.CREDIT_CARD, Constants.PAYMENT_METHOD.DEBIT_CARD], paymentMode)) {
                if (paymentStatus === Constants.PAYMENT_STATUS.COMPLETED) {
                    Utils.populateValidationObject(validationObject, true, 'Valid');
                } else if (paymentStatus === Constants.PAYMENT_STATUS.PENDING_CONFIRMATION) {
                    Utils.populateValidationObject(validationObject, true, 'Payment Pending confirmation. Check after sometime');
                } else if (paymentStatus === Constants.PAYMENT_STATUS.FAILED) {
                    Utils.populateValidationObject(validationObject, false, 'Payment Failed. Please revise payment');
                } else {
                    Utils.populateValidationObject(validationObject, false, 'Invalid payment status');
                }
            } else if(paymentMode === Constants.PAYMENT_METHOD.CASH_ON_DELIVERY) {
                Utils.populateValidationObject(validationObject, true, 'Valid');
            } else {
                Utils.populateValidationObject(validationObject, false, 'Invalid Payment Method');
            }
        }
    }

    static _validateOrderItems(orderItems, validationObject) {
        return new Promise((resolve, reject) => {
            // Validate the following:
            // quantity of each order is non-zero,
            // product_ids passed are valid product ids
            // Populate validationObject based on the data
            return resolve(validationObject);
        })
    }

    static _validateAccount(accountId, validationObject) {
        return new Promise((resolve, reject) => {
            //Fetch account details to check if it is a valid account. returning true for now.
            validationObject.isValid = true;
            return resolve();
        })
    }

    static validateOrderCountWithInventoryCount(inventoryCountResults, orderCountMap) {
        var sufficientProductCodes = [];
        var lackingProductCodes = [];
        _.each(inventoryCountResults, function (inventoryProductRecord) {
            var productCode = _.get(inventoryProductRecord, 'productCode');
            var availableQuantity = _.get(inventoryProductRecord, 'quantity');
            if(availableQuantity >= _.get(orderCountMap, [productCode])) {
                sufficientProductCodes.push(productCode);
            } else {
                lackingProductCodes.push(productCode);
            }
        });
        return {sufficient_products: sufficientProductCodes, 'lacking_products': lackingProductCodes};
    }
}

module.exports = OrderHelper;
