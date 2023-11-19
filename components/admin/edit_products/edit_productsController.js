const products = require("./edit_productsService");
const qs = require("qs");
const path = require('path');
const upload = require('../../../middleware/upload');
const resize = require('../../../middleware/edit_products/resize');
const accounts = require("../edit_accounts/accountsService");
exports.product = async (req, res) => {
  res.render("admin/edit_products/products", {
    layout: "admin_layout",
  });
};

exports.details = async (req, res, next) => {
  const { id:id } = req.params;

  const detail = await products.getId(id);
  console.log(detail);
  res.render('admin/edit_products/details', {
    detail,
    layout: "admin_layout"});
};

exports.delete = async (req, res, next) => {
  await products.delete(req.params.id);
  res.redirect("/admin/edit_products");
};

exports.saveEdit = async (req, res, next) => {
  const id = req.body.ProductID[0];
  const imagePath = path.join(__dirname,'../../../','/public/assets_menu/img/menu');
  const product = req.body;
  if (!req.file) {
    await products.saveEdit(product);
    res.redirect("/admin/edit_products");
  }
  else {
    const fileUpload = new resize(imagePath, id);
    const filename = await fileUpload.save(req.file.buffer);
    await products.editImage(id);
    res.redirect("/admin/edit_products");
  }
};


exports.add = async (req, res, next) => {
  const nextId = await products.nextId();
  var id = nextId[0].nextId
  res.render('admin/edit_products/add', {
    id,
    layout: "admin_layout"
  });
}

exports.saveAdd = async (req, res, next) => {
  const id = req.body.Id;
  const imagePath = path.join(__dirname,'../../../','/public/assets_menu/img/menu');
  const product = req.body;
  if (!req.file) {
    await products.add(product);
    res.redirect("/admin/edit_products");
  }
  else {
    const fileUpload = new resize(imagePath, id);
    const filename = await fileUpload.save(req.file.buffer);
    await products.add(product);
    res.redirect("/admin/edit_products");
  }
}

exports.removeImage = async (req, res) => {
  const id = req.params.id;
  await products.removeImage(id);
  res.redirect("/admin/edit_products");
}
exports.paginator = async (req, res) => {
  try{
    let page = parseInt(req.body.page);
    let limit = parseInt(req.body.size);
    let search = req.body.search ? req.body.search : -1;
    let name = (req.body.namesorting === 'true');
    let price = (req.body.pricesorting === 'true');
    let category = req.body.category ? req.body.category : -1;
    let desc = (req.body.desc === 'true');

    const offset = page ? page * limit : 0;

    console.log("offset = " + offset);

    var result = [];
    var arr = [];
    var countTotal = -1;
    if(search != -1){
      result = await products.getSearch(search, offset, limit);
      countTotal = await products.countSearch(search);
    }else {
      // NOT Filtering with salary
      if (category < 0 || category == 'All') {
        countTotal = await products.countAll();
        // not sorting with name
        if (name == true) {
          if (desc == false) { // sorting with name and ascending
            let sort = 'asc';
            result = await products.getNameSorted(category, sort, offset, limit);
          } else { // sorting with name and descending
            let sort = 'desc';
            result = await products.getNameSorted(category, sort, offset, limit);
          }
        } else if (price == true) {
          if (desc == false) {
            let sort = 'asc';
            result = await products.getPriceSorted(category, sort, offset, limit);
          } else { // sorting with name and descending
            let sort = 'desc';
            result = await products.getPriceSorted(category, sort, offset, limit);
          }
        } else {
          result = await products.getLimitProducts(category, offset, limit);
        }
      } else { // Filtering with category
        // not sorting with name
        if (name == true) {
          if (desc == false) { // sorting with name and ascending
            let sort = 'asc';
            result = await products.getNameSorted(category, sort, offset, limit);
          } else { // sorting with name and descending
            let sort = 'desc';
            result = await products.getNameSorted(category, sort, offset, limit);
          }
        } else if(price == true){
          if (desc == false) {
            let sort = 'asc';
            result = await products.getPriceSorted(category, sort, offset, limit);
          } else { // sorting with name and descending
            let sort = 'desc';
            result = await products.getPriceSorted(category, sort, offset, limit);
          }
        }
        else {
          result = await products.getLimitProducts(category, offset, limit);
        }
      }
    }

    var tmp;
    if(countTotal == -1)
      tmp = result.length
    else tmp = Object.values(countTotal)[0].count_all;

    const totalPages = Math.ceil(tmp / limit);
    const response = {
      "totalPages": totalPages,
      "pageNumber": page,
      "pageSize": result.length,
      "products": result
    };
    res.send(response);
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }
}

exports.getCategory = async (req, res) => {
  try {
    const result = await products.getAllCategory();
    var category = [];
    for(var i in result)
      category.push([result[i]['category']]);
    res.send(category);
  } catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT get all category",
      error: error.message
    });
  }
}
