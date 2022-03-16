const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
const validator = require('../validator/user');

router.post('/register', validator.register, authController.register);
router.post('/login', validator.login, authController.login);
// router.delete('/logout', authController.logout);

module.exports = router;
