'use strict';

const PAYMENT_METHOD = {
    'CREDIT_CARD': 'CREDIT_CARD',
    'DEBIT_CARD': 'DEBIT_CARD',
    'CASH_ON_DELIVERY': 'CASH_ON_DELIVERY'
};

const PAYMENT_STATUS = {
    'PENDING': 'PENDING',
    'PENDING_CONFIRMATION': 'PENDING_CONFIRMATION',
    'COMPLETED': 'COMPLETED',
    'FAILED': 'FAILED'
};

const ORDER_STATUS = {
    'PLACED': 'PLACED',
    'IN_TRANSIT': 'IN_TRANSIT',
    'DELIVERED': 'IN_TRANSIT',
    'CANCELLED': 'IN_TRANSIT'
}

const DB_CONSTANTS = {
    QUERY_TIMEOUT: 60*5000
}

module.exports = {
    PAYMENT_METHOD,
    PAYMENT_STATUS,
    DB_CONSTANTS,
    ORDER_STATUS
};
