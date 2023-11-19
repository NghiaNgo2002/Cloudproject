const globalVar = require('./globalVar');
const authorizeService = require('./authorizeService');

function loginPage(res){
    isLogin = 0;
    res.render('index', { title: 'Express', layout: false});
}

exports.authorize = async (req, res)=>{
    if(isLogin === 1){
        res.redirect('/admin');
        return;
    }
    if(isLogin === 2){
        res.redirect('/user');
        return;
    }
    const {username : username, password : password} = req.query;
    if(typeof(username) === 'undefined'|| typeof(password) === 'undefined'){
        loginPage(res);
        return;
    }
    var account = await authorizeService.getAccount(username, password);
    if(typeof(account) === 'undefined'){
        loginPage(res);
        return;
    }
    agent = account;
    account = Object.values(account);
    if(account[1] === username && account[2] === password){
        if(username === "admin"){
            isLogin = 1;
            res.redirect("/admin");
            return;
        }
        isLogin = 2;
        res.redirect("/user");
        return;
    }
     
}

exports.none = (req, res)=>{
    isLogin = 0;
    res.redirect('/');
}