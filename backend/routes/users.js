const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User created!',
                        result: result
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        message: 'Could not create user',
                        error: error
                    })
                });
        });
});

router.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email, username: req.body.username })
        .then(user => {
            if  (!user) {
                res.status(404).json({
                    message: 'User doesnt exist'
                });
            }
            return bcrypt.compare(re.body.password, user.password)
        })
        .then(result => {
            if (!result) {
                res.status(404).json({
                    message: 'Wrong Password'
                });
            };
            const token = jwt.sign({
                username: user.username,
                email: user.email, 
                userId: user._id
            }, 'secret', {expiresIn: '1h'});
        })
});

module.exports = router;