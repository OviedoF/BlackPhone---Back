const brandsController = require('../controllers/brands.controller');
const express = require('express');
const router = express.Router();

router.get('/setIndexAlphaberticallly', brandsController.setIndexAlphaberticallly);
router.put('/changeBrandIndex/:id', brandsController.changeBrandIndex);

router.get('/', brandsController.getBrands);
router.post('/', brandsController.createBrand);
router.put('/:id', brandsController.editBrand);
router.delete('/:id', brandsController.deleteBrand);

module.exports = router;