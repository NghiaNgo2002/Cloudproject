const apiRepository = require('./apiRepository');
const bcrypt = require('bcryptjs');

exports.phonenumberExists = async (phonenumber) => {
    return await apiRepository.phonenumberExists(phonenumber);
}

exports.emailExists = async (email) => {
    return await apiRepository.emailExists(email);
}

exports.checkPassword = async (phonenumber, password) => {
    const user = await apiRepository.getUserByPhonenumber(phonenumber);
    if(!user) return false;
    if(await bcrypt.compare(password,Object.values(user)[2]))
        return true;
    return false;
}