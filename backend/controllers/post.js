var Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.username
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'Post added',
            post: {
                ...createdPost,
                id: createdPost._id,
            }
        });
    });
}

exports.fetchPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    postQuery.then(documents => {
        fetchedPosts = documents
        return Post.countDocuments();    
    }).then(count => {
        res.status(200).json({
            message: 'posts fetched successfully',
            posts: fetchedPosts, 
            maxPosts: count
        });
    });
}

exports.fetchPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        }
        else {
            res.status(404).json({message: 'Post not found'});
        }
    });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.body.id, 
        title: req.body.title, 
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.username
});
    Post.updateOne({_id: req.params.id, creator: req.userData.username}, post)
        .then(result => {
            if (result.n > 0) {        
                res.status(200).json({
                    message: 'Post updated'
                });
            }
            else {
                res.status(401).json({
                    message: 'Not authorized!'
                })
            }

        })
}

exports.deletePost =  (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.username}).then(result => {
        console.log(result);
        if (result.n > 0) {        
            res.status(200).json({
                message: 'Post Deleted'
            });
        }
        else {
            res.status(401).json({
                message: 'Not authorized!'
            })
        }
    });
}
