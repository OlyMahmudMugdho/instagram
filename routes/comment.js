const router = require('express').Router();
const addCommentController = require('../controllers/addCommentController');
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const editCommentController = require('../controllers/editCommentController').editComment;
const getAllCommentsController = require('../controllers/getAllCommentsController');
const deleteCommentController = require('../controllers/deleteCommentController').deleteComment;

router.route('/comment/:postUserID/:postId')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, getAllCommentsController.getAllComments)
    .post(checkJWT.check, verifyAccessToken.verifyAccess, addCommentController.addComment)

router.route('/comment/:postUserID/:postId/:commentID')
    .put(checkJWT.check, verifyAccessToken.verifyAccess, editCommentController)
    .delete(checkJWT.check, verifyAccessToken.verifyAccess, deleteCommentController)


module.exports = router;