module.exports = (req, res, next) => {
    if(!req.user){
        res.redirect("/");
        return;
    }else if(Object.values(req.user)[0] !== 1){
        res.redirect("/user");
        return;
    }
    next();
};