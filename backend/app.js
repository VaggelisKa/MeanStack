var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var postsRoutes = require('./routes/posts');

var app = express();

mongoose.connect('mongodb+srv://Vaggelis:WMWhztV00SN8qaoC@cluster0-oaxjo.mongodb.net/node-angular?retryWrites=true&w=majority', 
                { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true,})
    .then(() => {
        console.log('connected to database');
    })
    .catch(() => {
        console.log('connection failed');
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-Width, Content-Type, Accept'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
