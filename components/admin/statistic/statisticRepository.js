const db = require('../../../db');

exports.getAll = async () => {
    const result =  await db.connection.execute('select * from history');
    return result[0];
}

exports.getPrice = async (year) => {
    const result =  await db.connection.execute('select sum(PRICE) as PRICE, MONTH(TIME) as TIME from history where YEAR(TIME) = ? group by MONTH(TIME)', [year]);
    return result[0];
}

exports.getTopProducts = async (type) => {
    var result;
    const d = new Date();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    let yy = new Date().getFullYear();
    let dd = String(d.getDate()).padStart(2, '0');
    let current = yy + "-" + mm + "-" + dd;
    if(type == "yearProduct")
        result =  await db.connection.execute('select name, sum(count) as counts from history_food where year(TIME) = ? group by NAME order by count(*) desc limit 3', [yy]);
    else if(type == "monthProduct")
        result =  await db.connection.execute('select name, sum(count) as counts from history_food where month(TIME) = ? and year(TIME) = ? group by NAME order by count(*) desc limit 3', [mm, yy]);
    else result =  await db.connection.execute('select name, sum(count) as counts from history_food where TIME = ? group by NAME order by count(*) desc limit 3', [current]);
    return result[0];
}

exports.getYear = async () => {
    const result =  await db.connection.execute('select distinct year(TIME) as year from history');
    return result[0];
};

exports.getMonth = async (month) => {
    var year = new Date().getFullYear();
    const result =  await db.connection.execute('select sum(PRICE) as PRICE, DAY(TIME) as TIME from history where month(TIME) = ? and year(TIME) = ? group by DAY(TIME)', [month, year]);
    return result[0];
}