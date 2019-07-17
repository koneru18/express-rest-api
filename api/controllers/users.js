const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./../models/user');

exports.signUp = (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            console.log('user', user);
            if(user) {
                return res.status(409).json({
                    message: "User already exists !!"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName
                        });
                        user.save()
                        .then(result => res.status(201).json({
                            message: "User created"
                        }))
                        .catch(err => res.status(500).json({
                            error: err
                        }))
                    }
                })
            }
        })
        .catch(err => res.status(500).json({
            error: err
        }))
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .exec()
        .then(user => {
            if (user) {
                console.log('User: ', user);
                bcrypt.compare(req.body.password, user.password, function(err, result) {
                    if (result) {
                        const token = jwt.sign(
                            {   email: user.email,
                                password: user.password
                            },
                            process.env.JWT_KEY,
                            { expiresIn: '1h'}
                        );

                        return res.status(200).json({
                            message: "Auth Successfull !!",
                            token: token
                        });
                    }
                    return res.status(401).json({
                        message: "Auth failed !!"
                    });
                });
            } else {
                return res.status(404).json({
                    message: "User doesn't exists !!"
                });
            }
        })
        .catch(err => {
            console.log('err', err);
            res.status(500).json({
            error: err
        })})
};

exports.deleteUser = async (req, res, next) => {
    User.deleteOne({ _id: req.param.userId}).exec()
        .then(result => {
            console.log('result', result);
            res.status(200).json({
            message: "User deleted !!"
        })})
        .catch(err => res.status(500).json({
            error: err
        }))
}