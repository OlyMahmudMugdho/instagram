const router = require('express').Router();
const registerController = require('../controllers/registerController');

router.route('/register')
    .post(registerController.doRegister);

module.exports = router;