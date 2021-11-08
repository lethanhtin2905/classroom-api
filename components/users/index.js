var express = require('express');
var router = express.Router();
const UserController = require('./usersController');
const passport = require('./passport.js');
const passportFb = require('./passport_facebook.js');
/* POST Log In. */
router.post('/logIn', UserController.logIn);

/* GET Log In With Facebook. */
router.get('/auth/facebook', passportFb.authenticate("facebook", {
    scope: ["email"],
    session: false
}));
router.get("/auth/facebook/redirect", passportFb.authenticate('facebook', { session: false }), UserController.redirectFacebookID);
/* POST Log In With Facebook. */
router.post('/logInWithFacebook', UserController.logInWithFacebook);

/* POST Sign Up. */
router.post('/signUp', UserController.signUp);

// /* POST Update profile. */
// router.post('/updateProfile', passport.authenticate('jwt', { session: false }), UserController.updateProfile);

module.exports = router;