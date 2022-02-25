const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
const validator = require('../validator/auth');

router.post('/register', validator.validateRegister, authController.register);
router.post('/login', validator.validateLogin, authController.login);
router.delete('/logout', authController.logout);

module.exports = router;
