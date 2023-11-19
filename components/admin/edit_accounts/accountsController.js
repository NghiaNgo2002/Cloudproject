const accounts = require("./accountsService");
const bcrypt = require('bcryptjs');

exports.account = async (req, res) => {
  res.render("admin/edit_accounts/accounts", {
    layout: "admin_layout",
  });
};

exports.details = async (req, res, next) => {
  const { id:id } = req.params;
  
  const detail = await accounts.getId(id);
  
  res.render('admin/edit_accounts/details', {
    detail,
    layout: "admin_layout"});
};

exports.saveEdit = async (req, res, next) => {
  const account = req.body;
  await accounts.saveEdit(account);
  
  res.redirect("/admin/edit_accounts");
};

exports.add = async (req, res, next) => {
  const nextId = await accounts.nextId();

  res.render('admin/edit_accounts/add', {
    nextId,
    layout: "admin_layout"
  });
}

exports.saveAdd = async (req, res, next) => {
  const account = req.body;
  var password = account['Password'];
  const salt = await bcrypt.genSalt(10);
  var tmp = await bcrypt.hash(password, salt);
  account['Password'] = tmp;
  await accounts.add(account);
  res.redirect('/admin/edit_accounts');
}

exports.setLock = async (req, res, next) => {
  const account = req.body;
  account['ACTIVE'] = 0;
  await accounts.setLock(account);
  res.redirect('/admin/edit_accounts');
}

exports.setUnLock = async (req, res, next) => {
  const account = req.body;
  account['ACTIVE'] = 1;
  await accounts.setUnLock(account);
  res.redirect('/admin/edit_accounts');
}

exports.paginator = async (req, res) => {
  try{
    let page = parseInt(req.body.page);
    let limit = parseInt(req.body.size);
    let search = req.body.search ? req.body.search : -1;
    let phone = (req.body.phonesorting === 'true');
    let date = (req.body.datesorting === 'true');
    let category = req.body.category ? req.body.category : -1;
    let desc = (req.body.desc === 'true');

    const offset = page ? page * limit : 0;

    console.log("offset = " + offset);
    var result = [];
    var arr = [];
    var countTotal = -1;
    var tmp;

    if(search != -1){
      result = await accounts.getSearch(search, offset, limit);
      countTotal = await accounts.countSearch(search);
    }
    else {
      // NOT Filtering with salary
      if (category < 0 || category == 'All') {
        countTotal = await accounts.countAll();
        // not sorting with name
        if (phone == true) {
          if (desc == false) { // sorting with phone and ascending
            let sort = 'asc';
            result = await accounts.getNameSorted(category, sort, offset, limit);
          } else { // sorting with phone and descending
            let sort = 'desc';
            result = await accounts.getNameSorted(category, sort, offset, limit);
          }
        }
        else if (date == true) {
          if (desc == false) { // sorting with date and ascending
            let sort = 'asc';
            result = await accounts.getDateSorted(category, sort, offset, limit);
          } else { // sorting with date and descending
            let sort = 'desc';
            result = await accounts.getDateSorted(category, sort, offset, limit);
          }
        }
        else {
          result = await accounts.getLimitAccounts(category, offset, limit);
        }
      }
      else { // Filtering with category
        // not sorting with phone
        if (phone == true) {
          if (desc == false) { // sorting with phone and ascending
            let sort = 'asc';
            result = await accounts.getNameSorted(category, sort, offset, limit);
          } else { // sorting with name and descending
            let sort = 'desc';
            result = await accounts.getNameSorted(category, sort, offset, limit);
          }
        }
        else if (date == true) {
          if (desc == false) { // sorting with date and ascending
            let sort = 'asc';
            result = await accounts.getDateSorted(category, sort, offset, limit);
          }
          else { // sorting with name and descending
            let sort = 'desc';
            result = await accounts.getDateSorted(category, sort, offset, limit);
          }
        }
        else{
            result = await accounts.getLimitAccounts(category, offset, limit);
        }
      }
    }

    if(countTotal == -1)
      tmp = result.length
    else tmp = Object.values(countTotal)[0].count_all;
    const totalPages = Math.ceil(tmp / limit);
    const response = {
      "totalPages": totalPages,
      "pageNumber": page,
      "pageSize": result.length,
      "accounts": result
    };
    res.send(response);
  }catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT complete a paging request!",
      error: error.message,
    });
  }
}

exports.getActive = async (req, res) => {
  try {
    const result = await accounts.getCategory();
    var category = [];
    for(var i in result)
      category.push([result[i]['ACTIVE']]);
    res.send(category);
  } catch(error) {
    res.status(500).send({
      message: "Error -> Can NOT get all customer's salaries",
      error: error.message
    });
  }
}

