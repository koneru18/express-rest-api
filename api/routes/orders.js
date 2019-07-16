const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('./../models/order');

router.get('/', (req, res, next) => {
    Order.find().select('_id product quantity')
    .then(result => {
        const response = {
            count: result.length,
            orders: result
        }
        return res.status(200).json(response);
    })
    .catch(err => res.status(500).json({error: err}));
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
    });
    order.save()
    .then(result => {
        return res.status(201).json({
            message: 'Order Created',
            createdOrder: {
                _id: result._id,
                quantity: result.quantity,
                product: result.productId,
            }
        });
    })
    .catch(err => res.status(500).json({error: err}));
});

router.get('/:orderId', (req, res, next) => {
    const orderId = req.param.orderId;
    Order.findById(orderId).exec()
    .then(result => {
        if (result) {
            const response = {
                _id: result._id,
                quantity: result.quantity,
                product: result.productId,
            }
            return res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'Order not found',
            })
        }
    })
    .catch()
});

router.delete('/:orderId', (req, res, next) => {
    const orderId = req.params.productId;
    Order.remove({_id: orderId}).exec()
    .then(result => res.status(200).json({
        message: "Order deleted"
    }))
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router;
