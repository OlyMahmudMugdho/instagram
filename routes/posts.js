const express = require('express');
const router = express.Router();
const allPostsController = require('../controllers/allPostsController');
const createPostController = require('../controllers/createPostController');
const checkRoute = require('../middlewares/checkRoute');
const checkJWT = require('../middlewares/checkJWT');
const verifyJWT = require('../middlewares/verifyJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const fileUpload = require('express-fileupload');
const editPostController = require('../controllers/editPostController');
const getSinglePostController = require('../controllers/getSinglePostController');
const deletePostController = require('../controllers/deletePostController');
const change = require('../middlewares/changeParam').change;

require('dotenv').config();

router.route('/posts')
    .get(checkRoute.checkUrl, checkJWT.check, verifyAccessToken.verifyAccess, allPostsController.showAllPosts)
    .post(verifyAccessToken.verifyAccess, fileUpload({ createParentPath: true }), createPostController.createPost)


router.route('/posts/:postUserID/:postId')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, getSinglePostController.getSinglePost)
    .put(checkJWT.check, verifyAccessToken.verifyAccess, editPostController.editPost)
    .delete(checkJWT.check, verifyAccessToken.verifyAccess, deletePostController.deletePost)



module.exports = router;