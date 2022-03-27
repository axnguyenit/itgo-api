const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/OrderController');
const authentication = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');

router.get('/my-orders', authentication.verifyAccessToken, orderController.getByUser);
router.get('/:id', authentication.verifyAccessToken, orderController.show);
router.get('/', authentication.verifyAccessToken, authorization.isAdmin, orderController.index);

module.exports = router;
