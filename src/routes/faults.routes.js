const express = require('express');
const router = express.Router();
const { getFaults, createFault, updateFault, deleteFault } = require('../controllers/faults.controller');

router.get('/', getFaults);
router.post('/', createFault);
router.put('/', updateFault);
router.put('/delete', deleteFault);

module.exports = router;