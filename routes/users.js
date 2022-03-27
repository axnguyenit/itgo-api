const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const validator = require('../validator/user');
const authentication = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');

router.put(
	'/:id',
	authentication.verifyAccessToken,
	authorization.canUpdateAccount,
	validator.updateAccount,
	userController.updateAccount
);
router.post(
	'/change-password',
	authentication.verifyAccessToken,
	validator.changePassword,
	userController.changePassword
);
router.put(
	'/ban-user/:id',
	authentication.verifyAccessToken,
	authorization.isAdmin,
	userController.banUser
);
router.get('/my-account', authentication.verifyAccessToken, userController.myAccount);
router.get('/user/:id', authentication.verifyAccessToken, userController.show);
router.get('/', authentication.verifyAccessToken, authorization.isAdmin, userController.index);

module.exports = router;
