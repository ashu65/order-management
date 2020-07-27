var mongoose = require('mongoose');
var SchemaTypes = require('../../../utils/SchemaTypes');

var ItemSchema = {
    product_code: SchemaTypes.STRING,
    product_name: SchemaTypes.STRING,
    quantity: SchemaTypes.POSITIVE_NUMBER
}
var OrderSchema = new mongoose.Schema({
    //uniquely generated order-id
    order_id: SchemaTypes.STRING,
    // Timestamp of the update
    date: SchemaTypes.DATE,
    // account id for which the order is placed
    account_id: SchemaTypes.STRING,
    // Items as part of order
    items: [ItemSchema],
    //address for the order placed
    order_address: SchemaTypes.STRING,
    //payment_status
    payment_status: SchemaTypes.ENUM(['COMPLETED', 'PENDING', 'FAILED']),
    //payment_mode
    payment_mode: SchemaTypes.ENUM(['CREDIT_CARD', 'DEBIT_CARD', 'CASH_ON_DELIVERY']),
    //Order Status
    order_status: SchemaTypes.ENUM(['PLACED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']),
})

var OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;

// The date on which the follow up for this update is planned.
// Same as the meeting field in this update, if it has one.

