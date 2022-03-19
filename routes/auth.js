const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
const validator = require('../validator/user');

router.post('/register', validator.register, authController.register);
router.post('/login', validator.login, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.get('/reset-password/:id/:token', authController.checkRequestResetPassword);
router.post('/reset-password/:id/:token', validator.resetPassword, authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
