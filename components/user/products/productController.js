const globalVar = require('../../../routes/globalVar');

exports.details = (req, res)=>{
  if(!globalVar.getIsLogin()){
    res.redirect("/");
  }
  res.render('user/product/details', {layout: "user_layout"});
}