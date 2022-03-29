const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/OrderController');
const { verifyAccessToken } = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');

router.get('/my-orders', verifyAccessToken, orderController.getByUser);
router.get('/:id', verifyAccessToken, orderController.show);
router.get('/', verifyAccessToken, authorization.isAdmin, orderController.index);

module.exports = router;
