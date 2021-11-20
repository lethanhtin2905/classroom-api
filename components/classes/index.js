const express = require('express');
const router = express.Router();
const passport = require('../users/passport');
const classesController = require('./classesController');

/* GET all Classes. */
router.get('/', passport.authenticate('jwt', { session: false }), classesController.myClasses);

router.get('/:id', passport.authenticate('jwt', { session: false }), classesController.getClass);

router.get('/:id/user', passport.authenticate('jwt', { session: false }), classesController.getUserOfClass);

router.post('/', passport.authenticate('jwt', { session: false }), classesController.addClass);

module.exports = router;