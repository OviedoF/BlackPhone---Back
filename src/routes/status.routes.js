const StatusController = require('../controllers/status.controller');
const router = require('express').Router();

router.get('/', StatusController.getStatus);
router.post('/', StatusController.createStatus);
router.put('/:id', StatusController.updateStatus);
router.delete('/:id', StatusController.deleteStatus);

module.exports = router;
