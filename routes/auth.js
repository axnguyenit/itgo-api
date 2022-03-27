const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
const authentication = require('../app/middleware/authentication');
const validator = require('../validator/user');

router.post('/register', validator.register, authController.register);
router.post('/login', validator.login, authController.login);
router.post('/refresh-token', authentication.verifyRefreshToken, authController.refreshToken);
router.post('/forgot-password', validator.forgotPassword, authController.forgotPassword);
router.get('/reset-password/:id/:token', authController.checkRequestResetPassword);
router.post('/reset-password/:id/:token', validator.resetPassword, authController.resetPassword);
router.post('/verify', validator.verifyEmail, authController.requestVerifyEmail);
router.get('/verify/:id/:token', authController.verifyEmail);

module.exports = router;
