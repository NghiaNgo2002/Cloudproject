const nodemailer = require("nodemailer");
const verifyService = require("./verifyService");

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const resetPasswordSchema = require('../_auth/schema/reset_password');

const ajv = new Ajv();
addFormats(ajv);

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "netcafe.cdp@gmail.com",
        pass: "klrzkgiazzxskfck"
    }
});

var ID, EMAIL, mailOptions_account, mailOptions_password, host, link;

exports.showAccount = (req, res) => {
    res.render('verify/account', {layout: false});
}

exports.emailAccount = async (req, res) =>{
    ID = req.user.ID;
    host = req.get('host');
    link = "https://"+host+"/verify/verifyAccount?id="+ID;
    mailOptions_account = {
        from: "netcafe.cdp@gmail.com",
        to : req.user.EMAIL,
        subject : "PLEASE CONFIRM YOUR EMAIL ACCOUNT",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
    }
    await smtpTransport.sendMail(mailOptions_account, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.response);
        }
    });
    res.redirect('/verify');
}

exports.verifyAccount = (req, res) => {
    if(req.get('host')===(host)){
        if(Number(req.query.id)===ID)
        {
            console.log("email is verified");
            //res.end("<h1>Email "+mailOptions_account.to+" is been Successfully verified");
            verifyService.verifyAccount(ID);
            res.render('verify/account_successful', {layout: false});
            req.logout(function (err){
                if(err){
                    return next(err);
                }
            });
        }
        else
        {   
            console.log("email is not verified");
            res.render('verify/account_failed', {layout: false});
            //res.end("<h1>Bad Request</h1>");
        }
    }else{
        res.end("<h1>Request is from unknown source");
    }
}

exports.emailPassword = async (req, res) => {
    const{email : email} = req.query;
    EMAIL = email;
    host = req.get('host');
    link = "https://"+host+"/verify/verifyPassword?email="+email;
    mailOptions_password = {
        from: "netcafe.cdp@gmail.com",
        to : email,
        subject : "RESET YOUR PASSWORD",
        html : "Hello,<br> Please Click on the link to reset your password.<br><a href="+link+">Click here to reset your password</a>"
    };
    await smtpTransport.sendMail(mailOptions_password, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.response);
        }
    });
    res.render('verify/password', {layout: false});
}

exports.verifyPassword = (req, res) => {
    console.log(req.get('host'));
    console.log(host);
    if(req.get('host')===(host)){
        console.log(EMAIL);
        console.log(req.query.email);
        if(req.query.email===EMAIL)
        {
            console.log("reset password");
            res.render('verify/reset_password', {layout: false});
        }
        else
        {   
            console.log("cannot reset password");
            res.render('verify/password_failed', {layout: false});
        }
    }else{
        res.render('verify/password_failed', {layout: false});
    }
}

exports.resetPassword = async (req, res) => {
    if(!ajv.validate(resetPasswordSchema, req.body)){
        res.render('verify/reset_password', { layout: false, error: 'Invalid input!'});
        return;
    }
    const {
        newpassword : newpassword,
        renewpassword : renewpassword
    } = req.body;
    if(newpassword !== renewpassword){
        res.render("verify/reset_password", { layout: false, error: 'New passwords do not match!'});
        return;
    }else{
        try{
            await verifyService.changePassword(EMAIL, newpassword);
            res.render('verify/password_successful', {layout: false});
            return;
        }catch(e){
            res.render('verify/password_failed', { layout: false});
            return;
        }
    }
}