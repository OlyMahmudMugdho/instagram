const router = require('express').Router();
const generate = require('../controllers/helpers/generateFolllows').generate;


router.route('/helper')
    .get(generate)


module.exports = router;
