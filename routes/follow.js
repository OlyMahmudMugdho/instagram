const router = require('express').Router();

const followersController = require('../controllers/followersController');
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

router.route('/follow/:followingID')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, followersController.follow)



module.exports = router;