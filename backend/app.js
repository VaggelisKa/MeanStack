var express = require('express');
var bodyParser = require('body-parser');

var app = express();

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
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post added'
    });
});

app.get('/api/posts', (req, res, next) => {
    const posts = [
       {
           id: 'dadasasa', 
           title: 'first server side post', 
           content: 'this is coming from the server' 
        },

        {
            id: 'niksaaasss',
            title: 'Second server side post',
            content: 'this is coming from the server too'
         },
    ];

    res.status(200).json({
        message: 'posts fetched successfully',
        posts: posts
    });
});

module.exports = app;
