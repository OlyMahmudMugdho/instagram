const router = require('express').Router();
const generate = require('../controllers/helpers/generateFolllows').generate;
const generateComments = require('../controllers/helpers/generateComments').generateComments;

router.route('/helper')
    .get(generate)
router.route('/helper/comments')
    .get(generateComments)

module.exports = router;
