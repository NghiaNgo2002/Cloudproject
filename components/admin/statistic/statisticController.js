const statistic = require("./statisticService")
exports.statistic = async (req, res) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  let result = await statistic.getYear();
  result["currentYear"] = new Date().getFullYear();
  res.render("admin/statistic/statistic", {
    result,
    monthNames,
    layout: "admin_layout" });
};

exports.statisticData = async (req, res) => {
  var year = req.body;
  let result = await statistic.getPrice(year.year);
  res.send(result);
};

exports.statisticDataByMonth = async (req, res) => {
  var month = req.body.month;
  var months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var month1 = months.indexOf(month) + 1;
  let result = await statistic.getMonth(month1);
  var year = new Date().getFullYear();
  for(let i =  0; i < result.length; i++)
  {
    var t = result[i]['TIME'];
    var m = "-" + month1 + "-" + year;
    result[i]['TIME'] = result[i]['TIME'] + m;
  }
  res.send(result);
};

exports.topProductsData = async (req, res) => {
  let result = await statistic.getTopProducts(req.body.data);
  res.send(result);
}