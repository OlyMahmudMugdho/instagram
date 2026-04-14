const router = require('express').Router();
const suggestUserController = require('../controllers/suggestUserController');
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');

router.get('/suggestions', checkJWT.check, verifyAccessToken.verifyAccess, suggestUserController.suggestUsers);

module.exports = router;
