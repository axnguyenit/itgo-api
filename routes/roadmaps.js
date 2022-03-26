const express = require('express');
const roadmapController = require('../app/controllers/RoadmapController');
const verifyToken = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');
const validator = require('../validator/roadmap');

const router = express.Router();

router.get('/:id', roadmapController.show);
router.put('/:id', verifyToken, authorization.isAdmin, validator.roadmap, roadmapController.update);
router.delete('/:id', verifyToken, authorization.isAdmin, roadmapController.destroy);
router.post('/', verifyToken, authorization.isAdmin, validator.roadmap, roadmapController.store);
router.get('/', roadmapController.index);

module.exports = router;
