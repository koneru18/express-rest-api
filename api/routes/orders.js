const express = require('express');
const router = express.Router();
const Product = require('./../models/product');
const checkAuth = require('./../middleware/check-auth');
const OrderController = require('./../controllers/orders');

router.get('/', checkAuth, OrderController.getOrders);

router.post("/", checkAuth, OrderController.createOrder);

router.get('/:orderId', checkAuth, OrderController.getOrderById);

router.delete('/:orderId', checkAuth, OrderController.deleteOrder);

module.exports = router;
