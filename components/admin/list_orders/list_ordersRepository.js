const db = require('../../../db');

exports.getLimit = async (offset, limit) => {
    const result =  await db.connection.execute("SELECT IDBILL, PHONENUMBER, PRICE, TIME, STATUS FROM history, accounts where history.IDUSER = accounts.ID order by TIME desc, IDBILL desc limit " +
                                                                        limit +
                                                                        " offset " +
                                                                        offset);
    return result[0];
}

exports.filter = async (name) => {
    const result =  await db.connection.execute("select * from history where name like ?", [`%${name}%`]);
    return result[0];
}

exports.getId = async (id) => {
    const result =  await db.connection.execute('select accounts.ID as ID, accounts.PHONENUMBER as PHONENUMBER, history.PRICE as PRICE, STATUS from history, accounts where idbill = ? and iduser = accounts.id', [id]);
    return result[0][0];
}

exports.delete = async (id) => {
    await db.connection.execute("Update history set STATUS = 'Cancel' where IDBILL = ?", [id]);
}

exports.saveEdit = async (id) => {
    var obj = Object.values(id);
    console.log(obj[2]);
    const result = await db.connection.execute("Update accounts INNER JOIN history set accounts.Budget = accounts.Budget + " + obj[2] +
                                                    " , STATUS = 'Done' where  IDUSER = accounts.ID and IDBILL = ?", [obj[3]]);
    return result[0];
}

exports.countSearch = async (search) => {
    const result = await db.connection.execute("select count(*) as countAll from history  where TIME like ?" , [`%${search}%`]);
    return result[0];
}

exports.countAll = async (category) => {
    var result;
    if(category < 0 || category == 'All')
    {
        result = await db.connection.execute("SELECT count(*) as countAll FROM history");
    }
    else{
        result = await db.connection.execute("SELECT count(*) as countAll FROM history where STATUS = ?", [category]);
    }
    return result[0];
}
exports.add = async (account, nextId) => {
    var obj = Object.values(account);
    var id = Object.values(nextId);
    const result =  await db.connection.execute('insert into history set ID = ?, name = ?, PASSWORD = ?, FULLNAME = ?, LEVEL = ?, IMAGE = ?, BUDGET = ?, ACTIVE = ?', [id[0], obj[0], obj[1], obj[2], 'waiting', obj[3], obj[4], 1]);
    //const result =  await db.connection.execute("insert into history set ?", [account]);
    return result[0];
}


exports.getCategoryLimit = async (category, offset, limit) => {
    const result = await db.connection.execute("SELECT IDBILL, PHONENUMBER, PRICE, TIME, STATUS FROM history, accounts where history.IDUSER = accounts.ID and history.STATUS = ? order by TIME desc, IDBILL desc limit " +
                                                                    limit +
                                                                    " offset " +
                                                                    offset, [category]);
    return result[0];
}

exports.getSearch = async (search, offset, limit) => {
    const result = await db.connection.execute("SELECT IDBILL, PHONENUMBER, PRICE, TIME, STATUS FROM history, accounts where history.IDUSER = accounts.ID and TIME like ? order by TIME desc, IDBILL desc limit " +
        limit +
        " offset " +
        offset, [`%${search}%`]);
    return result[0];
}

exports.getNameAsc = async () => {
    const result = await db.connection.execute("select * from history ORDER BY name ASC");
    console.log(result[0]);
    return result[0];
}

exports.getNameDesc = async () => {
    const result = await db.connection.execute("select * from history ORDER BY name DESC");
    console.log(result[0]);
    return result[0];
}