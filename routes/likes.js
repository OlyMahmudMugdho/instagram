const router = require('express').Router();
const likePostController = require('../controllers/likePostController');
const verifyAccess = require('../middlewares/verifyAccessToken').verifyAccess;
const checkJWT = require('../middlewares/checkJWT');

router.route('/like/:userID/:postId')
    .get(checkJWT.check, verifyAccess, likePostController.likePost)


module.exports = router;