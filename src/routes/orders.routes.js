const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrders);
router.post('/createRecognizedLocalOrder', orderController.createRecognizedLocalOrder);
router.post('/createRecognizedOutsideOrder', orderController.createRecognizedOutsideOrder);
router.post('/createDontListenedItemOrder', orderController.createDontListenedItemOrder);

module.exports = router;