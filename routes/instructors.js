const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const verifyToken = require('../app/middleware/authentication');

router.get('/', userController.getAllInstructors);

module.exports = router;
