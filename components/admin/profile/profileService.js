const profileRepository = require('./profileRepository');
const authorizeRepository = require('../../_auth/authorizeRepository');
const bcrypt = require('bcryptjs');

exports.editInfo = async (fullname, phonenumber, email, current_phonenumber, current_email)=>{
    if(phonenumber !== current_phonenumber && await authorizeRepository.phonenumberExists(phonenumber))
        throw new Error('Phone number is exists!');
    if(email !== current_email && await authorizeRepository.emailExists(email))
        throw new Error('Email is exists!');
    return await profileRepository.editInfo(fullname, phonenumber, email, current_phonenumber);
}

exports.changePassword = async (phonenumber, password, newpassword) =>{
    const user = await authorizeRepository.getUserByPhonenumber(phonenumber);
    if(!user) return null;
    if(await bcrypt.compare(password,Object.values(user)[2])){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(newpassword, salt);
        return await profileRepository.changePassword(hash, phonenumber);
    }else throw new Error('Current password is not correct!');
}

exports.editAvatar = async(id) => {
    return await profileRepository.editAvatar(id);
}

exports.removeAvatar = async(id) => {
    return await profileRepository.removeAvatar(id);
}