const profileService = require('./profileService');
const authorizeRepository = require('../../_auth/authorizeRepository');

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const self_editProfileSchema = require('../../_auth/schema/self_editProfile');
const self_changePasswordSchema = require('../../_auth/schema/self_changePassword');
const path = require('path');
const upload = require('../../../middleware/upload');
const resize = require('../../../middleware/resize');

const ajv = new Ajv();
addFormats(ajv);

exports.profileRedirect = (req, res) => {
    res.redirect("/admin/profile");
}

exports.profile = async (req, res) => {
  res.render("admin/profile/profile", { layout: "admin_layout" });
};

exports.editProfile = async (req, res) => {
    if(!ajv.validate(self_editProfileSchema, req.body)){
        res.render("admin/profile/profile", { layout: "admin_layout", error: 'Invalid input!'});
        return;
    }
    const {
        fullname : fullname,
        phonenumber : phonenumber,
        email : email,
    } = req.body;
    const temp = Object.values(req.user);
    try{
        const user = await profileService.editInfo(fullname, phonenumber, email, temp[1], temp[3]);
        req.logIn(user, function(error){
            if(!error){
                console.log(req.user);
                res.redirect("/admin/profile");
            }
        });
    }catch(e){
        res.render("admin/profile/profile", { layout: "admin_layout", error: e.message});
        return;
    }
}

exports.changePassword = async (req, res)=>{
    if(!ajv.validate(self_changePasswordSchema, req.body)){
        res.render("admin/profile/profile", { layout: "admin_layout", error: 'Invalid input!'});
        return;
    }
    const {
        password : password,
        newpassword : newpassword,
        renewpassword : renewpassword
    } = req.body;
    const temp = Object.values(req.user);
    if(newpassword !== renewpassword){
        res.render("admin/profile/profile", { layout: "admin_layout", error: 'New passwords do not match!'});
        return;
    }else{
        try{
            const user = await profileService.changePassword(temp[1], password, newpassword);
            req.logIn(user, function(error){
                if(!error){
                    console.log(req.user);
                    res.redirect("/admin/profile");
                }
            });
        }catch(e){
            res.render("admin/profile/profile", { layout: "admin_layout", error: e.message});
            return;
        }
    }
}

exports.editAvatar = async (req, res)=>{
    const id = Object.values(req.user)[0];
    const imagePath = path.join(__dirname,'../../../','/public/assets_niceadmin/img');
    
    const fileUpload = new resize(imagePath, id);
    if (!req.file) {
        res.status(401).json({error: 'Please provide an image'});
    }
    const filename = await fileUpload.save(req.file.buffer);
    try{
        const user = await profileService.editAvatar(id);
        req.logIn(user, function(error){
            if(!error){
                console.log(req.user);
                res.redirect("/admin/profile");
            }
        });
    }catch(e){
        res.render("admin/profile/profile", { layout: "admin_layout", error: e.message});
        return;
    }
}

exports.removeAvatar = async (req, res) => {
    try{
        const user = await profileService.removeAvatar(Object.values(req.user)[0]);
        req.logIn(user, function(error){
            if(!error){
                console.log(req.user);
                res.redirect("/admin/profile");
            }
        });
    }catch(e){
        res.render("admin/profile/profile", { layout: "admin_layout", error: e.message});
        return;
    }
}

exports.signout = (req, res) => {
    req.logout(function (err){
        if(err){
            return next(err);
        }
        res.redirect('/');
    })
}