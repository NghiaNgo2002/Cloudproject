const { connection } = require("../../../db");
const products_menuRepository = require("./products_menuRepository");

exports.getAll = () => {
  return products_menuRepository.getAll();
};

exports.count = (name) => {
  return products_menuRepository.count(name);
};

exports.sort = (products, typeSort) => {
  if (typeSort == "low") {
    products.sort((a, b) => a.PRICE - b.PRICE);
  } else if (typeSort == "high") {
    products.sort((a, b) => b.PRICE - a.PRICE);
  }
  return products;
};

exports.getLimit = (limit, offset, name) => {
  return products_menuRepository.getLimit(limit, offset, name);
};

exports.getCategory = (category) => {
  return products_menuRepository.getCategory(category);
};

exports.filter = (name) => {
  return products_menuRepository.filter(name);
};

exports.get = (id) => {
  return products_menuRepository.get(id);
};
