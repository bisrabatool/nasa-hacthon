const express = require('express');
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/authController');
const { googleLogin } = require('../controllers/googleController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);


router.get("/google",passport.authenticate("google",{scope:["profile","email"]}));

router.get("/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:3000/Home",
    failureRedirect:"http://localhost:3000/Login"
}))

router.post('/google/login', googleLogin); 
module.exports = router;
