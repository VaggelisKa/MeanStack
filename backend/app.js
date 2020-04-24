var express = require('express');

var app = express();

app.use((req, res, next) => {
    console.log('first middleware');
    next();
});

app.use((req, res, next) => {
    res.send('Hello from res');
});

module.exports = app;
