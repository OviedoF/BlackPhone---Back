const router = require('express').Router();

const WholesaleRequestController = require('../controllers/wholesaleRequest.controller');

router.get('/', WholesaleRequestController.getWholesaleRequests);
router.get('/:id', WholesaleRequestController.getWholesaleRequest);
router.post('/', WholesaleRequestController.createWholesaleRequest);
router.delete('/:id', WholesaleRequestController.deleteWholesaleRequest);

module.exports = router;