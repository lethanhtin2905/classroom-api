const express = require('express');
const router = express.Router();
const passport = require('../users/passport');
const classesController = require('./classesController');

/* GET all Classes. */
router.get('/', passport.authenticate('jwt', { session: false }), classesController.myClasses);

router.get('/:id', passport.authenticate('jwt', { session: false }), classesController.getClass);

router.get('/:id/users', passport.authenticate('jwt', { session: false }), classesController.getUserOfClass);

router.post('/:id/invited', passport.authenticate('jwt', { session: false }), classesController.invitedUser);

router.get('/:id/grade-structure', passport.authenticate('jwt', { session: false }), classesController.getGradeStructure);

router.post('/:id/grade-structure', passport.authenticate('jwt', { session: false }), classesController.addGrade);

// router.post('/:id/grade-structure/delete', passport.authenticate('jwt', { session: false }), classesController.deleteGrade);

// router.post('/:id/grade-structure/update', passport.authenticate('jwt', { session: false }), classesController.updateGrade);

router.post('/:id/grade-structure/arrange', passport.authenticate('jwt', { session: false }), classesController.arrangeGrade);

router.post('/', passport.authenticate('jwt', { session: false }), classesController.addClass);

module.exports = router;