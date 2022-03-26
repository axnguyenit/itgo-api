const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const validator = require('../validator/user');
const verifyToken = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');

router.put(
	'/:id',
	verifyToken,
	authorization.canUpdateAccount,
	validator.updateAccount,
	userController.updateAccount
);
router.put('/ban-user/:id', verifyToken, authorization.isAdmin, userController.banUser);
router.get('/my-account', verifyToken, userController.myAccount);
router.get('/user/:id', verifyToken, userController.show);
router.get('/', verifyToken, authorization.isAdmin, userController.index);

module.exports = router;
