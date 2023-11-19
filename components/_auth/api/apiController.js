const apiService = require('./apiService');

exports.verifyPhonenumber = async (req, res)=>{
    const {phonenumber:phonenumber} = req.params;
    const result = await apiService.phonenumberExists(phonenumber);
    res.json(!result);
}

exports.verifyEmail = async (req, res)=>{
    const {email:email} = req.params;
    const result = await apiService.emailExists(email);
    res.json(!result);
}

exports.verifyPassword = async (req, res)=>{
    const {password:password} = req.params;
    const result = await apiService.checkPassword(Object.values(req.user)[1], password);
    res.json(result);
}