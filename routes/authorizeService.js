const authorizeRepository = require('./authorizeRepository');

exports.getAccount = (username, password)=>{
    return authorizeRepository.getAccount(username, password);
}
