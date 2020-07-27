var express = require('express');
var router = express.Router();
var controller = require('../api/controllers/order');

/* GET users listing. */
router.post('/', controller.createOrder );
router.get('/:order_id', controller.getOrder);

module.exports = router;
