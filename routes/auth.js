const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
const validator = require('../validator/auth');
const verifyToken = require('../app/middleware/authentication');

router.post('/register', validator.register, authController.register);
router.post('/login', validator.login, authController.login);
router.get('/my-account', verifyToken, authController.myAccount);
// router.delete('/logout', authController.logout);

module.exports = router;
