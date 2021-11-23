const SALT_ROUNDS = 7;

const clientDomain = 'http://localhost:3000';
const serverDomain = 'http://localhost:3030';
const redirectPath = '/redirect';
const tokenCheckIn = '&token=';

// Messages
const logInInvalid = "Username or Password invalid!!!";
const emailExisted = "Email has already existed";
const usernameExisted = "User name has already existed";
const signUpSuccess = "Register successfully !!!";
const signUpFail = "Register fail !!!";
const updateProfileSuccess = "Update Profile success !!!";
const updateProfileFail = "Update Profile fail !!!";

module.exports = {
    
    SALT_ROUNDS,
    serverDomain,
    clientDomain,
    redirectPath,
    tokenCheckIn,
    // Messages
    logInInvalid,
    usernameExisted,
    emailExisted,
    signUpSuccess,
    signUpFail,
    updateProfileSuccess,
    updateProfileFail
}