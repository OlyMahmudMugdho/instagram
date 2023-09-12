const router = require('express').Router();
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const getPaginatedUsersController = require("../controllers/getPaginatedUsersController");
const getRandomUsersController = require("../controllers/getRandomUsersController");

router.route('/users')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, getRandomUsersController.getRandomUsers)

router.route('/users/:page')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, getPaginatedUsersController.getUsers);

module.exports = router;