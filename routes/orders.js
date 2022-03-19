const express = require('express');
const router = express.Router();
const orderController = require('../app/controllers/OrderController');
const verifyToken = require('../app/middleware/authentication');
const authorization = require('../app/middleware/authorization');

router.get('/my-orders', verifyToken, orderController.getByUser);
router.get('/:id', verifyToken, orderController.show);
router.get('/', verifyToken, authorization.isAdmin, orderController.index);

module.exports = router;
