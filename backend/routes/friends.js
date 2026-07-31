const router = require('express').Router();
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const friendController = require('../controllers/friendController');

router.use(checkJWT.check, verifyAccessToken.verifyAccess);

router.get('/requests', checkJWT.check, verifyAccessToken.verifyAccess, friendController.getReceivedRequests);
router.post('/request', checkJWT.check, verifyAccessToken.verifyAccess, friendController.sendRequest);
router.post('/accept', checkJWT.check, verifyAccessToken.verifyAccess, friendController.acceptRequest);
router.get('/list', checkJWT.check, verifyAccessToken.verifyAccess, friendController.getFriends);

module.exports = router;
