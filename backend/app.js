var express = require('express');

var app = express();

app.use('/api/posts', (req, res, next) => {
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
