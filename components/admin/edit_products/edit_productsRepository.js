const db = require('../../../db');

exports.getAll = async () => {
    const result =  await db.connection.execute('select * from menu');
    return result[0];
}

exports.filter = async (name) => {
    const result =  await db.connection.execute("select * from menu where name like ?", [`%${name}%`]);
    return result[0];
}

exports.getId = async (id) => {
    const result =  await db.connection.execute('select * from menu where id = ?', [id]);
    return result[0][0];
}


exports.delete = async (id) => {
    await db.connection.execute('delete from menu where id = ?', [id]);
}

exports.saveEdit = async (id) => {
    var obj = Object.values(id);
    const result = await db.connection.execute("UPDATE menu SET NAME = ?, IMAGE = ?, PRICE = ?, CATEGORY = ?, STATUS = ? where ID = ?;", [obj[1],`menu-item-${obj[0]}.png`, obj[2], obj[3], obj[4],obj[0]]);
    return result[0][0];
}

exports.editImage = async (id) => {
    const result = await db.connection.execute("UPDATE menu SET IMAGE = ? where ID = ?;", [`menu-item-${id}.png`, id]);
    return result[0][0];
}

exports.nextId = async () => {
    const result = await db.connection.execute("SELECT MAX(ID) + 1 as nextId FROM menu");
    return result[0];
}
exports.add = async (product) => {
    var obj = Object.values(product);
    const result =  await db.connection.execute('insert into menu set ID = ?, NAME = ?, IMAGE = ?, PRICE = ?, CATEGORY = ?, STATUS = ?', [obj[0], obj[1], `menu-item-${obj[0]}.png`, obj[2], obj[3], obj[4]]);
    //const result =  await db.connection.execute("insert into menu set ?", [account]);
    return result[0];
}

exports.countAll = async () => {
    const result = await db.connection.execute("select count(*) as count_all from menu");
    return result[0];
}
exports.getAllCategory = async () => {
    const result = await db.connection.execute("select distinct category from menu ");
    return result[0];
}

exports.getCategory = async (category) => {
    const result = await db.connection.execute("select * from menu where category = ?", [category]);
    return result[0];
}

exports.getSearch = async (search, offset, limit) => {
    const result = await db.connection.execute("select * from menu  where name like ? limit " +
                                            limit +
                                            " offset " +
                                            offset, [`%${search}%`]);
    return result[0];
}
exports.countSearch = async (search) => {
    const result = await db.connection.execute("select count(*) as count_all from menu where name like ?", [`%${search}%`]);
    return result[0];
}

exports.getNameAsc = async (category, offset, limit) => {
    var result;
    if(category < 0 || category == 'All') {
        result = await db.connection.execute("select * from menu ORDER BY NAME ASC limit " +
            limit +
            " offset " +
            offset);
    }
    else{
        result = await db.connection.execute("select * from menu where category = ? ORDER BY NAME ASC limit " +
            limit +
            " offset " +
            offset, [category]);
    }
    return result[0];
}

exports.getNameDesc = async (category, offset, limit) => {
    var result;
    if(category < 0 || category == 'All') {
        result = await db.connection.execute("select * from menu ORDER BY NAME DESC limit " +
            limit +
            " offset " +
            offset);
    }
    else{
        result = await db.connection.execute("select * from menu where category = ? ORDER BY NAME DESC limit " +
            limit +
            " offset " +
            offset, [category]);
    }
    return result[0];
}

exports.getPriceAsc = async (category, offset, limit) => {
    var result;
    if(category < 0 || category == 'All') {
        result = await db.connection.execute("select * from menu ORDER BY PRICE ASC limit " +
            limit +
            " offset " +
            offset);
    }
    else{
        result = await db.connection.execute("select * from menu where category = ? ORDER BY PRICE ASC limit " +
            limit +
            " offset " +
            offset, [category]);
    }
    return result[0];
}

exports.getPriceDesc = async (category, offset, limit) => {
    var result;
    if(category < 0 || category == 'All') {
        result = await db.connection.execute("select * from menu ORDER BY PRICE DESC limit " +
            limit +
            " offset " +
            offset);
    }
    else{
        result = await db.connection.execute("select * from menu where category = ? ORDER BY PRICE DESC limit " +
            limit +
            " offset " +
            offset, [category]);
    }
    return result[0];
}

exports.getLimitProducts = async (category, offset, limit) => {
    var result;
    if(category < 0 || category == 'All') {
        result = await db.connection.execute("select * from menu limit " +
            limit +
            " offset " +
            offset);
    }
    else {
        result = await db.connection.execute("select * from menu where category = ? limit " +
            limit +
            " offset " +
            offset, [category]);
    }
    return result[0];
}

exports.removeImage = async(id) => {
    await db.connection.execute("UPDATE menu SET IMAGE = ? WHERE ID = ?;", ['default-item.png', id]);
}