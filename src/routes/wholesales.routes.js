const router = require('express').Router();
const WholesalePetitionsController = require('../controllers/WholesalePetitions.controller');

router.get('/pdf/:id', WholesalePetitionsController.createPricesPdf);
router.get('/pdf-outside/:id', WholesalePetitionsController.createPricesOutsidePdf);
router.get('/download-pdf', WholesalePetitionsController.downloadPricesPdf)
router.get('/', WholesalePetitionsController.getWholesalePetitions);
router.get('/:id', WholesalePetitionsController.getWholesalePetition);
router.post('/', WholesalePetitionsController.createWholesalePetition);
router.put('/approve/:id', WholesalePetitionsController.approve);
router.put('/reject/:id', WholesalePetitionsController.reject);
router.delete('/:id', WholesalePetitionsController.deleteWholesalePetition);

module.exports = router;