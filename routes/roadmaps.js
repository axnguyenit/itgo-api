const express = require('express');
const roadmapController = require('../app/controllers/RoadmapController');
const authentication = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');
const validator = require('../validator/roadmap');

const router = express.Router();

router.get('/:id', roadmapController.show);
router.put(
	'/:id',
	authentication.verifyAccessToken,
	authorization.isAdmin,
	validator.roadmap,
	roadmapController.update
);
router.delete(
	'/:id',
	authentication.verifyAccessToken,
	authorization.isAdmin,
	roadmapController.destroy
);
router.post(
	'/',
	authentication.verifyAccessToken,
	authorization.isAdmin,
	validator.roadmap,
	roadmapController.store
);
router.get('/', roadmapController.index);

module.exports = router;
