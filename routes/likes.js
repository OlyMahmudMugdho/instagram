const router = require('express').Router();
const likePostController = require('../controllers/likePostController');
const unlikePostController = require('../controllers/unlikePostController');
const verifyAccess = require('../middlewares/verifyAccessToken').verifyAccess;
const checkJWT = require('../middlewares/checkJWT');
const checkisLiked = require('../controllers/isLiked').checkisLiked;

router.route('/like/:userID/:postId')
    .get(checkJWT.check, verifyAccess, likePostController.likePost)
router.route('/isliked/:userID/:postId')
    .get(checkJWT.check, verifyAccess, checkisLiked)

router.route('/unlike/:userID/:postId')
    .get(checkJWT.check, verifyAccess, unlikePostController.unlikePost);


module.exports = router;