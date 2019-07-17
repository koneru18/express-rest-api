const mongoose = require('mongoose');
const Product = require('./../models/product');

exports.getProducts = (req, res, next) => {
    Product.find().select('_id name price').exec()
    .then(result => {
        const response = {
            count: result.length,
            products: result
        }
        return res.status(200).json(response);
    })
    .catch(err => res.status(500).json({error: err}));
};

exports.createProduct = (req, res, next) => {
    console.log(`CheckAuth in Request: ${JSON.stringify(req.userData)}`)
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    product.save()
    .then(result => {
        return res.status(201).json({
            message: 'New Product Created',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
            }
        });
    })
    .catch(err => res.status(500).json({error: err}));
};

exports.getProductById = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).exec()
    .then(result => {
        console.log('result: ', result);
        if (result) {
            const response = {
                _id: result._id,
                name: result.name,
                price: result.price,
            }
            return res.status(200).json(response);
        } else {
            res.status(404).json({
                message: 'Product not found',
            })
        }
    })
    .catch(err => res.status(500).json({error: err}));
};

exports.updateProduct = (req, res, next) => {
    const productId = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value; 
    }
    Product.updateOne({ _id: productId }, {$set: updateOps}).exec()
    .then(result => res.status(200).json({
        message: "Product updated"
    }))
    .catch(err => res.status(500).json({error: err}));
};

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.remove({_id: productId}).exec()
    .then(result => res.status(200).json({
        message: "Product deleted"
    }))
    .catch(err => res.status(500).json({error: err}));
};