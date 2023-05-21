const express = require('express');
const router = express.Router();
const allPostsController = require('../controllers/allPostsController');
const checkRoute = require('../middlewares/checkRoute');
const checkJWT = require('../middlewares/checkJWT');
const verifyJWT = require('../middlewares/verifyJWT');
require('dotenv').config();

router.route('/posts')
    .get(checkRoute.checkUrl, checkJWT.check, verifyJWT.verify, allPostsController.showAllPosts);

module.exports = router;