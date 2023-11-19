module.exports = (req, res, next) => {
    if(!req.user){
        if(req.path !== '/password' && req.path !== '/verifyPassword'){
            res.redirect("/");
            return;
        }
    }
    next();
}