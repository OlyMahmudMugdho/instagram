const router = require('express').Router();
const mailToResetPasswordController = require('../controllers/mailToResetPasswordController');
const resetPasswordController = require('../controllers/resetPasswordController');
const validateResetPasswordToken = require('../middlewares/validateResetPasswordToken');
const checkTokenForPassword = require('../middlewares/checkTokenForPassword');


router.route('/reset/password/search')
    .post(mailToResetPasswordController.mailToResetPassword);

router.route('/reset/password/final')
    .post(validateResetPasswordToken.validate);
router.route('/reset/password/change')
    .post(checkTokenForPassword.validate,resetPasswordController.reset)

module.exports = router;