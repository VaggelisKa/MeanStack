const express = require('express');
const multer = require('multer');
const PostController = require('../controllers/post');

var checkAuth = require('../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("invalid mime type");
        if (isValid) { error = null };
        callback(error, "backend/images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('', checkAuth, multer({storage: storage}).single('image'), PostController.createPost);

router.get('', PostController.fetchPosts);

router.get('/:id', PostController.fetchPost);

router.put(
    '/:id',
    checkAuth, 
    multer({storage: storage}).single('image'),
    PostController.updatePost 
    );

router.delete('/:id', checkAuth, PostController.deletePost);

module.exports = router;
