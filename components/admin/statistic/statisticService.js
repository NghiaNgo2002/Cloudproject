const statisticRepository = require("./statisticRepository");

exports.getAll = () => {
    return statisticRepository.getAll();
};

exports.getPrice = (year) => {
    return statisticRepository.getPrice(year);
};

exports.getTopProducts = (type) => {
    return statisticRepository.getTopProducts(type);
};

exports.getYear = () => {
    return statisticRepository.getYear();
};

exports.getMonth = (month) => {
    return statisticRepository.getMonth(month);
};