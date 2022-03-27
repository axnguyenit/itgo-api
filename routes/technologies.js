const express = require('express');
const technologyController = require('../app/controllers/TechnologyController');
const authentication = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');
const validator = require('../validator/technology');
const router = express.Router();

router.put(
	'/:id',
	authentication.verifyAccessToken,
	authorization.isAdmin,
	validator.technology,
	technologyController.update
);
router.delete(
	'/:id',
	authentication.verifyAccessToken,
	authorization.isAdmin,
	technologyController.destroy
);
router.post(
	'/',
	authentication.verifyAccessToken,
	authorization.isAdmin,
	validator.technology,
	technologyController.show
);
router.get('/', technologyController.index);

module.exports = router;
