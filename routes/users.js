const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const validator = require('../validator/user');
const { verifyAccessToken } = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');

router.put(
	'/:id',
	verifyAccessToken,
	authorization.canUpdateAccount,
	validator.updateAccount,
	userController.updateAccount
);
router.post(
	'/change-password',
	verifyAccessToken,
	validator.changePassword,
	userController.changePassword
);
router.put('/ban-user/:id', verifyAccessToken, authorization.isAdmin, userController.banUser);
router.get('/my-account', verifyAccessToken, userController.myAccount);
router.get('/user/:id', verifyAccessToken, userController.show);
router.get('/', verifyAccessToken, authorization.isAdmin, userController.index);

module.exports = router;
