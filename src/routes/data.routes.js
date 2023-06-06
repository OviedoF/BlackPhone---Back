const pricesTableController = require('../controllers/pricesTable.controller');
const express = require('express');
const router = express.Router();

router.get('/pricesTable', pricesTableController.getPricesTableInfo);

module.exports = router;