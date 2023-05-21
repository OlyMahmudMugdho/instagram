const router = require('express').Router();
const getAccessTokenController = require('../controllers/getAccessTokenController');

router.route('/token')
    .get(getAccessTokenController.getAccessToken);

module.exports = router;