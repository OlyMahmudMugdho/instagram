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
const multer = require('multer');
const uuid = require('uuid');
const path = require('path');
const myPostsController = require('../controllers/getMyPostController');
const getPaginatedPostsController = require('../controllers/getPaginatedPostsController');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files')
    },
    filename: (req, file, cb) => {
        const extName = path.extname(file.originalname)
        const imagePath = Date.now() + uuid.v4() + extName;
        cb(null, imagePath)
    }
});


const upload = multer({ storage: storage });


require('dotenv').config();

router.route('/posts')
    .get(checkRoute.checkUrl, checkJWT.check, verifyAccessToken.verifyAccess, allPostsController.showAllPosts)
    .post(checkJWT.check, verifyAccessToken.verifyAccess, upload.array('image', 50), createPostController.createPost)

/* .post(verifyAccessToken.verifyAccess,fileUpload({ createParentPath: true }), createPostController.createPost) */

router.route('/posts/myposts')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, myPostsController.myPosts)

router.route('/posts/:page')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, getPaginatedPostsController.getPaginatedPosts)

router.route('/posts/:postUserID/:postId')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, getSinglePostController.getSinglePost)
    .put(checkJWT.check, verifyAccessToken.verifyAccess, editPostController.editPost)
    .delete(checkJWT.check, verifyAccessToken.verifyAccess, deletePostController.deletePost)



module.exports = router;
