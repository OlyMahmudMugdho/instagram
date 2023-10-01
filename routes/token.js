const router = require('express').Router();
const getAccessTokenController = require('../controllers/getAccessTokenController');
const verifyJWT = require('../middlewares/verifyJWT');

router.route('/token')
    .get(getAccessTokenController.getAccessToken);

module.exports = router;