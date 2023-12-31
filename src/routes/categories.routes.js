const categoriesController = require('../controllers/category.controller');
const express = require('express');
const router = express.Router();

router.get('/', categoriesController.get);
router.post('/', categoriesController.create);
router.put('/:id', categoriesController.edit);
router.delete('/:id', categoriesController.delete);

module.exports = router;