const orders = require("./list_ordersService");
exports.order = async (req, res) => {
    res.render("admin/list_orders/orders", {
        layout: "admin_layout",
    });
};

exports.details = async (req, res, next) => {
    const { id:idparam } = req.params;
    const detail = await orders.getId(idparam);
    detail["idparam"] = idparam;
    console.log(detail)
    res.render('admin/list_orders/details', {
        detail,
        layout: "admin_layout"});
};

exports.delete = async (req, res, next) => {
    const id = req.params.id;
    await orders.delete(id);
    res.redirect("/admin/list_orders");
};

exports.saveEdit = async (req, res, next) => {
    const product = req.body;
    product["idbill"] = req.params.id;
    await orders.saveEdit(product);
    res.redirect("/admin/list_orders");

};


exports.paginator = async (req, res) => {
    try{
        console.log(req.body);
        let page = parseInt(req.body.page);
        let limit = parseInt(req.body.size);
        let search = req.body.search ? req.body.search : -1;
        let category = req.body.category ? req.body.category : -1;

        const offset = page ? page * limit : 0;

        console.log("offset = " + offset);

        var result = [];
        var count = -1;

        if(search != -1){
            let date=search.split("-");
            if(parseInt(date[0]) <= 9 && date[0].length == 1)
            {
                date[0] = "0" + date[0];
            }
            if(parseInt(date[1]) <= 9 && date[1].length == 1)
            {
                date[1] = "0" + date[1];
            }
            let tmp = date[2] + "-" + date[1] + "-" + date[0];
            result = await orders.getSearch(tmp, offset, limit);
            count = await orders.countSearch(tmp);
        }else {
            // NOT Filtering
            if (category < 0 || category == 'All') {
                result = await orders.getLimit(offset, limit);
                count = await orders.countAll(category);
                //count = 1;
            } else { // Filtering with category
                result = await orders.getCategoryLimit(category, offset, limit);
                count = await orders.countAll(category);
                //count = 1;
            }
        }

        var tmp;
        if(count == -1)
        {
            tmp = result.length
        }
        else if(Object.values(count)[0].countAll > 25)
        {
            tmp = 25;
        }
        else tmp = Object.values(count)[0].countAll;
        console.log(tmp)
        const totalPages = Math.ceil(tmp / limit);;
        const response = {
            "totalPages": totalPages,
            "pageNumber": page,
            "pageSize": result.length,
            "orders": result
        };
        res.send(response);
    }catch(error) {
        res.status(500).send({
            message: "Error -> Can NOT complete a paging request!",
            error: error.message,
        });
    }
}


