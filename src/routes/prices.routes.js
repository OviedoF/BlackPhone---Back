const express = require('express');
const router = express.Router();
const pricesTableController = require('../controllers/pricesTable.controller');


router.get('/pdf', pricesTableController.downloadPricesPDF);
router.get('/download-pdf', pricesTableController.downloadPDF);
router.get('/models/:brand', pricesTableController.getAllModelsOfBrand);

router.get('/', pricesTableController.getPrices);
router.post('/', pricesTableController.createPrice);

router.put('/:id', pricesTableController.editPrice)
router.put('/', pricesTableController.updatePrices)
router.delete('/:id', pricesTableController.deletePrice);

router.put('/position/:id', pricesTableController.changePosition);

router.post('/calculateBudget', pricesTableController.calculateBudget);


module.exports = router;