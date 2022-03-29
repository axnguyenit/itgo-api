const express = require('express');
const applicationController = require('../app/controllers/ApplicationController');
const { verifyAccessToken } = require('../app/middleware/authentication');
const { isAdmin } = require('../app/middleware/authorization');
const { application } = require('../validator/application');
const router = express.Router();

router.get('/:id', verifyAccessToken, isAdmin, applicationController.show);
router.get('/', verifyAccessToken, isAdmin, applicationController.index);
router.post('/', verifyAccessToken, application, applicationController.store);
router.post('/:id/approve', verifyAccessToken, isAdmin, applicationController.approve);
router.post('/:id/deny', verifyAccessToken, isAdmin, applicationController.deny);

module.exports = router;
