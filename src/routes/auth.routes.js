const path = require('path');
const express = require('express');
const router = express.Router();
const authController = require(path.join(__dirname, '..', 'controllers', 'auth.controller'));

router.get('/whoami', authController.whoami)

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router;