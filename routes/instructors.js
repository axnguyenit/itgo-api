const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const validator = require('../validator/user');
const verifyToken = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');

// router.put(
// 	'/:id',
// 	verifyToken,
// 	authorization.canUpdateAccount,
// 	validator.updateAccount,
// 	userController.updateAccount
// );
router.get('/', userController.getAllInstructors);

module.exports = router;
