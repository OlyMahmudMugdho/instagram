const router = require('express').Router();
const searchController = require('../controllers/searchController');
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const verifyJWT = require('../middlewares/verifyJWT');

router.route('/')
    .get(verifyAccessToken.verifyAccess, searchController.search)

module.exports = router