const router = require('express').Router();
const addCommentController = require('../controllers/addCommentController');
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const editCommentController = require('../controllers/editCommentController').editComment;


router.route('/comment/:postUserID/:postId')
    .post(checkJWT.check, verifyAccessToken.verifyAccess, addCommentController.addComment)

    router.route('/comment/:postUserID/:postId/:commentID')
    .put(checkJWT.check, verifyAccessToken.verifyAccess, editCommentController)


module.exports = router;