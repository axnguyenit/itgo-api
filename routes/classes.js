const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');
const classController = require('../app/controllers/ClassController');

router.get('/:id', verifyAccessToken, authorization.canUpdateCourse, classController.getStudents); // id --> course ID

module.exports = router;
