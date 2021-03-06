const mongoose = require('mongoose');
const Order = require('./../models/order');

exports.getOrders = (req, res, next) => {
    Order.find()
    .select('_id product quantity')
    .populate('product', '_id name price')
    .exec()
    .then(result => {
        const response = {
            count: result.length,
            orders: result
        }
        return res.status(200).json(response);
    })
    .catch(err => res.status(500).json({error: err}));
};

exports.createOrder = (req, res, next) => {
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
};

exports.getOrderById = (req, res, next) => {
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
};

exports.deleteOrder = (req, res, next) => {
    Order.remove({_id: req.params.orderId}).exec()
    .then(result => res.status(200).json({message: "Order deleted"}))
    .catch(err => res.status(500).json({error: err}));
};