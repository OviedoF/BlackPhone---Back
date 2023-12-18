const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.get('/unrecognized', orderController.getUnrecognizedOrders);
router.get('/recognized', orderController.getRecognizedOrders);
router.get('/:id', orderController.getOrderById);

router.post('/', orderController.createOrder);

router.post('/createOrderDontRecognizedNothing', orderController.createOrderDontRecognizedNothing);
router.post('/createRecognizedLocalOrder', orderController.createRecognizedLocalOrder);
router.post('/createRecognizedOutsideOrder', orderController.createRecognizedOutsideOrder);
router.post('/createDontListenedItemOrder', orderController.createDontListenedItemOrder);

router.put('/:id/status', orderController.editOrderStatus);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;