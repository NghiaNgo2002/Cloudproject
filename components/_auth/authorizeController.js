const authorizeService = require('./authorizeService');

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const registerSchema = require('./schema/register');
const emailSchema = require('./schema/email');

const ajv = new Ajv();
addFormats(ajv);

exports.showLoginForm = (req, res) =>{
    var {error : error} = req.query;
    if(error === "1"){
        error = "Invalid username or password!";
    }else if(error === "2"){
        error = "Your account was banned!";
    }
    res.render('_auth/login', { title: 'Express', layout: false, error: error});
}

exports.showRegisterForm = (req, res) =>{
    res.render('_auth/register', { title: 'Express', layout: false});
}

exports.register = async (req, res) => {
    if(!ajv.validate(registerSchema, req.body)){
        res.render('_auth/register', { title: 'Express', layout: false, error: 'Invalid input!'});
        return;
    }
    const {
        fullname : fullname,
        phonenumber : phonenumber,
        email : email,
        password : password,
        repeatpassword : repeatpassword
    } = req.body;
    if(password !== repeatpassword){
        res.render('_auth/register', { title: 'Express', layout: false, error: 'Passwords do not match!'});
        return;
    }
    try{
        await authorizeService.register(fullname, phonenumber, email, password);
    }catch(e){
        res.render('_auth/register', { title: 'Express', layout: false, error: e.message});
        return;
    }
    const user = await authorizeService.getUserByPhonenumber(phonenumber);
    req.logIn(user, function(error){
        if(!error){
            res.redirect('/verify/account');
        }
    });
}

exports.showResetPasswordForm = (req, res) =>{
    res.render('_auth/password', {layout: false});
}

exports.resetPassword = async (req, res) =>{
    if(!ajv.validate(emailSchema, req.body)){
        res.render('_auth/password', { layout: false, error: 'Invalid input!'});
        return;
    }
    const {
        email : email,
    } = req.body;
    try{
        await authorizeService.checkEmail(email);
    }catch(e){
        res.render('_auth/password', { layout: false, error: e.message});
        return;
    }
    res.redirect('/verify/password?email='+email);
}