const webTextsController = require('../controllers/webTexts.controller');
const router = require('express').Router();

router.get('/', webTextsController.getWebTexts);

router.put('/', webTextsController.updateWebTexts);

router.post('/about-us', webTextsController.createAboutUsSection);
router.put('/about-us', webTextsController.updateAboutUsSection);
router.delete('/about-us/:id', webTextsController.deleteAboutUsSection);

router.post('/garantie', webTextsController.createGarantiesSection);
router.put('/garantie', webTextsController.updateGarantiesSection);
router.delete('/garantie/:id', webTextsController.deleteGarantiesSection);

module.exports = router