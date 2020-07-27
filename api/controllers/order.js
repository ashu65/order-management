const _ = require('lodash');
const OrderHelper = require('../helpers/OrderHelper');
const OrderService = require('../services/orderService');

class OrderController {
    static createOrder (req, res, next) {
        var body = _.get(req, 'body');
        OrderHelper.validateCreateOrderPayload(body).then(validationResponse => {
            if(_.get(validationResponse, 'isValid', false)) {
                var orderContext = {
                    account_id: _.get(body, "accountId"),
                    items: _.get(body, 'items'),
                    payment_status: _.get(body, 'payment_status'),
                    payment_mode: _.get(body, 'payment_mode'),
                    address: _.get(body, 'address')
                }
                OrderService.createNewOrder(orderContext).then(newOrder => {
                    res.json({order_status: 1, order: newOrder});
                }).catch(err => {
                    console.error('Failed to create order: ', err);
                    return next(new Error(err));
                })
            } else {
                console.log("Invalid Order Details.Not creating Order!!");
                res.json({order_status: 0, error: _.get(validationResponse, 'message')});
            }
        }).catch(err => {
            console.log("Failed to create order", err);
            return res.error({"message": "Failed to create order"});
        })
    }

    static getOrder(req, res, next) {
        var orderId = _.get(req, ['params', 'order_id']);
        OrderService.getOneOrder(orderId).then(orderDetails => {

        })

    }
}


module.exports = OrderController;
