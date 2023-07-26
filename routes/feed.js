const express = require('express');
const router = express.Router();
const newsFeedController = require('../controllers/newsFeedController').getFeed;
const checkJWT = require('../middlewares/checkJWT').check;
const verifyAccess = require('../middlewares/verifyAccessToken').verifyAccess;


router.route('/feed')
    .get(checkJWT, verifyAccess, newsFeedController);


module.exports = router;