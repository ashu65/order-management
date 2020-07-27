'use strict';
var _ = require('lodash');
var validate = require('mongoose-validator').validate;

// Common data types.
const STRING = {type: String, required: true, default: '', trim: true};
const NUMBER = {type: Number, required: true, default: 0};
const POSITIVE_NUMBER = {type: Number, required: true, default: 0, min: 1};
const OPTIONAL_NUMBER = {type: Number, required: false};
const BOOLEAN = {type: Boolean, required: true, default: false};
const DATE = {type: Date, required: true, default: Date.now, set: dateSetter};

function dateSetter(value) {
    return ((typeof value) === 'number') ? new Date(value) : value;
};

function ENUM(enumValues, defaultValue) {
    var dataType = _.clone(STRING);

    if (defaultValue) {
        dataType.default = defaultValue;
    }

    if (!_.isArray(enumValues)) {
        enumValues = _.values(enumValues);
    }

    dataType.enum = enumValues;
    return dataType;
};

module.exports = {
    STRING,
    NUMBER,
    POSITIVE_NUMBER,
    OPTIONAL_NUMBER,
    BOOLEAN,
    DATE,
    ENUM
};
