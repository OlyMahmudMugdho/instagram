const router = require('express').Router();
const getAccessTokenController = require('../controllers/getAccessTokenController');
const verifyJWT = require('../middlewares/verifyJWT');

router.route('/token')
    .get(verifyJWT.verify,getAccessTokenController.getAccessToken);

module.exports = router;