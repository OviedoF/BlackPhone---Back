const express = require('express');
const router = express.Router();
const additionalCostsController = require('../controllers/additionalCosts.controllers');

router.get('/', additionalCostsController.getAdditionalCosts);

router.post('/', additionalCostsController.createAdditionalCosts);

router.put('/:id', additionalCostsController.updateAdditionalCosts);

router.delete('/:id', additionalCostsController.deleteAdditionalCosts);

module.exports = router;