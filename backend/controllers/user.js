const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
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
}

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email})
        .then(user => {
            if  (!user) {
                return res.status(404).json({
                    message: 'User doesnt exist'
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            if (!result) {
                res.status(404).json({
                    message: 'Wrong Password'
                });
            };
            const token = jwt.sign({
                username: fetchedUser.username,
                email: fetchedUser.email, 
                userId: fetchedUser._id
            }, 'secret', {expiresIn: '1h'});

            res.status(200).json({
                message: 'User Logged in',
                username: fetchedUser.username,
                token: token,
                expiresIn: 3600
            });
        })
}
