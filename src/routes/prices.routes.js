const express = require('express');
const router = express.Router();
const pricesTableController = require('../controllers/pricesTable.controller');

router.get('/', pricesTableController.getPrices);
router.post('/', pricesTableController.createPrice);
router.put('/', pricesTableController.updatePrices)
router.delete('/:id', pricesTableController.deletePrice);

module.exports = router;