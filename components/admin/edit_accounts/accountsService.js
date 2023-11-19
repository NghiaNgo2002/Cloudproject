const { connection } = require("../../../db");
const accountsRepository = require("./accountsRepository");


exports.getAll = () => {
    return accountsRepository.getAll();
};

exports.filter = (name) => {
    return accountsRepository.filter(name);
};

exports.getId = (id) => {
    return accountsRepository.getId(id);
};

exports.saveEdit = (id) => {
    return accountsRepository.saveEdit(id);
};

exports.add = (account) => {
    return accountsRepository.add(account);
};

exports.nextId = () => {
    return accountsRepository.nextId();
}

exports.setLock = (id) => {
    return accountsRepository.setLockUnlock(id);
}

exports.setUnLock = (id) => {
    return accountsRepository.setLockUnlock(id);
}

exports.getSearch = (search, offset, limit) => {
    return accountsRepository.getSearch(search, offset, limit);
}
exports.countSearch = (search) => {
    return accountsRepository.countSearch(search);
}

exports.getNameSorted = (category, sort, offset, limit) => {
    if(sort == 'asc')
        return accountsRepository.getNameAsc(category, offset, limit);
    return accountsRepository.getNameDesc(category, offset, limit);
}

exports.getDateSorted = (category, sort, offset, limit) => {
    if(sort == 'asc')
        return accountsRepository.getDateAsc(category, offset, limit);
    return accountsRepository.getDateDesc(category, offset, limit);
}

exports.getAllActive = (category) => {
    return accountsRepository.getAllActive(category);
};

exports.getCategory = () => {
    return accountsRepository.getCategory();
};

exports.getLimitAccounts = (category, offset, limit) => {
    return accountsRepository.getLimitAccounts(category, offset, limit);
};

exports.countAll = () => {
    return accountsRepository.countAll();
}