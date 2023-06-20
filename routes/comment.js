const router = require('express').Router();
const addCommentController = require('../controllers/addCommentController');
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

router.route('/comment/:postUserID/:postId')
    .post(checkJWT.check, verifyAccessToken.verifyAccess, addCommentController.addComment);


module.exports = router;