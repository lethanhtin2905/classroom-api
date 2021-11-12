const express = require('express');
const router = express.Router();
const passport = require('../users/passport');
const classesController = require('./classesController');

/* GET all Classes. */
router.get('/', passport.authenticate('jwt', { session: false }), classesController.classes);

router.post('/', passport.authenticate('jwt', { session: false }), classesController.addClass);

module.exports = router;