var express = require('express');
var router = express.Router();
const UserController = require('./usersController');
const passport = require('./passport.js');
const passportFb = require('./passport_facebook.js');
/* POST Log In. */
router.post('/logIn', UserController.logIn);

router.post('/logInWithGoogle', UserController.logInWithGoogle);

/* POST Sign Up. */
router.post('/signUp', UserController.signUp);

// /* POST Update profile. */
// router.post('/updateProfile', passport.authenticate('jwt', { session: false }), UserController.updateProfile);

module.exports = router;