const router = require('express').Router();

const followersController = require('../controllers/followersController');
const unfollowController = require('../controllers/unfollowController');
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

router.route('/follow/:followingID')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, followersController.follow)

router.route('/unfollow/:followingID')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, unfollowController.unfollow)



module.exports = router;