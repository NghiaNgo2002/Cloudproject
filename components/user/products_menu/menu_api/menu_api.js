const products_menuService = require("../products_menuService");
const qs = require("qs");
const Paginator = require("paginator");

exports.getProductPage = async (req, res) => {
  // Arguments are `per_page` and `length`. `per_page` changes the number of
  // results per page, `length` changes the number of links displayed.
  let paginator = new Paginator(6, 3);
  const { page: curPage } = req.query;
  const { name: nameFilter } = req.query;
  const count = await products_menuService.count(nameFilter);
  let pagination_info = paginator.build(count, curPage);
  //name filter
  let products = [];
  products = await products_menuService.getLimit(
    pagination_info.results,
    pagination_info.first_result,
    nameFilter
  );
  // if (nameFilter) {
  //   products = await products_menuService.filter(nameFilter);
  // } else products = await products_menuService.getAll();
  //sort by price
  const { sort, ...withoutSort } = req.query;
  products = await products_menuService.sort(products, sort);
  // Arguments are `total_results` and `current_page`. I hope these are self
  // explanatory.

  return res.status(200).json({
    products: products,
    pagination_info: pagination_info,
  });
};
