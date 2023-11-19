module.exports = (req, res, next) => {
    if(req.user){
        if(Object.values(req.user)[0] === 1){
            res.redirect("/admin");
        }else res.redirect("/user");
    }
    next();
}