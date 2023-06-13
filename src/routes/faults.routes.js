const express = require('express');
const router = express.Router();
const { getFaults, createFault, updateFault, deleteFault } = require('../controllers/faults.controller');

router.get('/', getFaults);
router.post('/', createFault);
router.put('/:id', updateFault);
router.delete('/:id', deleteFault);

module.exports = router;