const router = require('express').Router();
const logOutController = require('../controllers/logOutController');

router.route('/logout')
    .get(logOutController.logOut);

module.exports = router;