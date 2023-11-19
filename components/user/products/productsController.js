const productsService = require("./productsService");
const relatedProductService = require("../products_menu/products_menuService");

exports.details = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productsService.get(productId);

  const relatedProducts = await relatedProductService.getCategory(
    product.CATEGORY
  );

  for (let [i, item] of relatedProducts.entries()) {
    if (item.ID == productId) {
      relatedProducts.splice(i, 1);
    }
  }
  const max =
    Object.keys(relatedProducts).length < 4
      ? Object.keys(relatedProducts).length
      : 4;

  relatedProducts.splice(-max - 1, -1);
  console.log(relatedProducts);
  res.render("user/products/details", {
    product,
    relatedProducts,
    originalUrl: `${req.baseUrl}`,
    layout: "user_layout",
  });
};

// exports.review = async (req, res, next) => {
//   res.render("user/products/review", {
//     layout: "user_layout",
//   });
// };
