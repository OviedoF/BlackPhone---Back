const express = require('express');
const router = express.Router();
const pricesTableController = require('../controllers/pricesTable.controller');


router.get('/pdf', pricesTableController.downloadPricesPDF);
router.get('/download-pdf', pricesTableController.downloadPDF);
router.get('/models/:brand', pricesTableController.getAllModelsOfBrand);

router.get('/', pricesTableController.getPrices);
router.post('/', pricesTableController.createPrice);

router.put('/position/:id', pricesTableController.changePosition);
router.put('/:id', pricesTableController.editPrice)
router.put('/', pricesTableController.updatePrices)
router.delete('/:id', pricesTableController.deletePrice);

router.post('/calculateBudget', pricesTableController.calculateBudget);

// router.get('/setPositions', pricesTableController.setPositionsByCreatedAt);

module.exports = router;