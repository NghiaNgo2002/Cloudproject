const ordersRepository = require("./list_ordersRepository");

exports.getLimit = ( offset, limit) => {
    return ordersRepository.getLimit(offset, limit);
};

exports.filter = (name) => {
    return ordersRepository.filter(name);
};

exports.getId = (id) => {
    return ordersRepository.getId(id);
};

exports.delete = (id) => {
    return ordersRepository.delete(id);
};

exports.saveEdit = (id) => {
    return ordersRepository.saveEdit(id);
};

exports.add = (account) => {
    return ordersRepository.add(account);
};

exports.countAll = (category) => {
    return ordersRepository.countAll(category);
}

exports.countSearch = (search) => {
    return ordersRepository.countSearch(search);
}

exports.getCategoryLimit = (category, offset, limit) => {
    return ordersRepository.getCategoryLimit(category, offset, limit);
}

exports.getSearch = (search, offset, limit) => {
    return ordersRepository.getSearch(search, offset, limit);
}

