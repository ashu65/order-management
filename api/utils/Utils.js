const mysql = require('mysql');
const _ = require('lodash');

class Utils {

    static populateValidationObject(validationObject, isValid, errorMessage) {
        validationObject.isValid = isValid;
        if(errorMessage) {
            validationObject.message = errorMessage;
        }
    }

    static getInQueryFromList(entityIdList) {
        var inquery = "(";
        if(!_.isEmpty(entityIdList)) {
            for (var u = 0; u < entityIdList.length; u++) {
                var entityId = entityIdList[u];
                inquery += Utils._addQuotesToString(entityId);
                if (u < entityIdList.length - 1) {
                    inquery += ",";
                }
            }
        } else {
            inquery+="''";
        }
        inquery += ")";
        return inquery;
    }


    static _addQuotesToString(str) {
        return "'" + str + "'";
    };

    static mysqlFormatQuery (query, placeholders) {
        var updatedQuery = mysql.format(query, placeholders);
        return updatedQuery;
    }
}

module.exports = Utils;
