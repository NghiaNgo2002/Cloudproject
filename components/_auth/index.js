const express = require('express');
const router = express.Router();

const authorizeController = require('./authorizeController');
const passport = require('./passport/index');

router.get('/', authorizeController.showLoginForm);
router.post('/', passport.authenticate('local',{
    //successRedirect: '/user',
    failureRedirect: '/auth?error=1',
}),
function(req, res){
    const user = req.user;
    if(Object.values(user)[9]==="1"){
        res.redirect("/user");
        return;
    }
    req.logout(function (err){});
    res.redirect("/auth?error=2");
    return;
}  
);

router.get('/register', authorizeController.showRegisterForm);
router.post('/register', authorizeController.register);

router.get('/password', authorizeController.showResetPasswordForm);
router.post('/password', authorizeController.resetPassword);

module.exports = router;