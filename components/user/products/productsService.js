const { connection } = require("../../../db");
const productsRepository = require("./productsRepository");

exports.get = (id) => productsRepository.get(id);

exports.getReviewList = (productID, limit, offset) => {
  if (productID == undefined || limit == undefined || offset == undefined) {
    return undefined;
  }
  return productsRepository.getReviewList(productID, limit, offset);
};

exports.countReviewList = (productID) => {
  return productsRepository.countReviewList(productID);
};

exports.insertReview = (userID, productID, comment) => {
  return productsRepository.insertReview(userID, productID, comment);
};
