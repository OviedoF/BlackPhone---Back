const pricesRulesController = require('../controllers/pricesRules.controller');
const express = require('express');
const router = express.Router();

router.get('/', pricesRulesController.getPricesRules);
router.put('/', pricesRulesController.editPricesRules);

module.exports = router;
