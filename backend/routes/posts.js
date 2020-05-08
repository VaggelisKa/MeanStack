const express = require('express');
const PostController = require('../controllers/post');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file-upload');

const router = express.Router();

router.post(
    '',
    checkAuth,
    extractFile,
    PostController.createPost
    );

router.get('', PostController.fetchPosts);

router.get('/:id', PostController.fetchPost);

router.put(
    '/:id',
    checkAuth, 
    extractFile,
    PostController.updatePost 
    );

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
