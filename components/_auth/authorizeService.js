const authorizeRepository = require('./authorizeRepository');
const bcrypt = require('bcryptjs');

exports.getUserByPhonenumber = async(phonenumber) => {
    return await authorizeRepository.getUserByPhonenumber(phonenumber);
}

exports.checkEmail = async(email) => {
    if(!await authorizeRepository.emailExists(email))
        throw new Error('Email is not exists!');
}

exports.register = async (fullname, phonenumber, email, password)=>{
    if(await authorizeRepository.phonenumberExists(phonenumber))
        throw new Error('Phone number is exists!');
    if(await authorizeRepository.emailExists(email))
        throw new Error('Email is exists!');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await authorizeRepository.insertUser(fullname, phonenumber, email, hash);
}

exports.checkUserCredential = async (phonenumber, password) => {
    const user = await authorizeRepository.getUserByPhonenumber(phonenumber);
    if(!user) return null;
    if(await bcrypt.compare(password,Object.values(user)[2]))
        return user;
    return null;
}