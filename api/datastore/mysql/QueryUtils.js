const Utils = require('../../utils/Utils');

class QueryUtils {
    static getselectProductCountsFromInventory(productCodes) {
        var selectProductCountsFromInventory = "SELECT productCode, quantity from order_management.inventory where productCode IN ";
        return selectProductCountsFromInventory + Utils.getInQueryFromList(productCodes) + " FOR UPDATE";
    }

    static getUpdateProductCountInInventory(productCode, quantity) {
        var updateProductCountInInventory = "UPDATE order_management.inventory set quantity = quantity - ? where productCode= ?";
        return Utils.mysqlFormatQuery(updateProductCountInInventory, [quantity, productCode]);
    }
}

module.exports = QueryUtils;
