const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('./../models/order');
const Product = require('./../models/product');

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

router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)
      .then(product => {
        if (!product) {
          return res.status(404).json({
            message: "Product not found"
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId
        });
        return order.save();
      })
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json(order);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id: req.params.orderId}).exec()
    .then(result => res.status(200).json({message: "Order deleted"}))
    .catch(err => res.status(500).json({error: err}));
});

module.exports = router;
