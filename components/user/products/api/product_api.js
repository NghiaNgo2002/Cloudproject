const productsService = require("../productsService");
const Paginator = require("paginator");

exports.getReviewList = async (req, res) => {
  let paginator = new Paginator(2, 3);
  const { productID: productID } = req.query;
  const { page: curPage } = req.query;

  const count = await productsService.countReviewList(productID);

  let list = [];
  let pagination_info = paginator.build(count, curPage);

  list = await productsService.getReviewList(
    productID,
    pagination_info.results,
    pagination_info.first_result
  );
  // for (let [key, value] of Object.entries(list)) {
  //   let str = value.TIME.toString();
  //   value.TIME = str.substring(0, 15);
  // }
  return res.status(200).json({
    list: list,
    pagination_info: pagination_info,
  });
};

exports.insertReview = async (req, res) => {
  const { comment: cmt } = req.body;
  const { productID: productID } = req.body;
  const userID = Object.values(req.user)[0];

  await productsService.insertReview(userID, productID, cmt);
  return res.status(200).json({});
};
