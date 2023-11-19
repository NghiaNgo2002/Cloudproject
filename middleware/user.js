module.exports = (req, res, next) => {
    if(!req.user){
        res.redirect("/");
        return;
    }else if(req.user.ID === 1){
        res.redirect("/admin");
        return;
    }else if(req.user.VERIFIED === '0'){
        res.redirect("/verify");
        return;
    }
    next();
};