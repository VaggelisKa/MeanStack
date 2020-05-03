const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.spliy(' ')[1];
        jwt.verify(token, 'secret');
        next();
    }   
    catch(error) {
        res.status(401).json({
            message: 'Not auth'
        });
    }
};
