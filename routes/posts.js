const express = require('express');
const router = express.Router();
const allPostsController = require('../controllers/allPostsController');
const createPostController = require('../controllers/createPostController');
const checkRoute = require('../middlewares/checkRoute');
const checkJWT = require('../middlewares/checkJWT');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const fileUpload = require('express-fileupload');
require('dotenv').config();

router.route('/posts')
    .get(checkRoute.checkUrl, checkJWT.check, verifyJWT.verify, allPostsController.showAllPosts)
    .post(verifyAccessToken.verifyAccess, fileUpload({ createParentPath: true }), createPostController.createPost);

module.exports = router;