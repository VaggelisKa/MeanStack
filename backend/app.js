var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Post = require('./models/post');

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    console.log(post);
    res.status(201).json({
        message: 'Post added'
    });
});

app.get('/api/posts', (req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents);
            res.status(200).json({
                message: 'posts fetched successfully',
                posts: documents
            });
        });
});

app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        
        res.status(200).json({
            message: 'post deleted successfully'
        });
    });
});

module.exports = app;
