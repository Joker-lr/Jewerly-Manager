'use strict';


module.exports = {
  queryset: async (ctx) => {
    console.log("queryset.");
    // const [data] = await ctx.db.query(`SELECT * FROM SettingLog`);
    let sdata = ctx.request.body;
    var myDate = new Date();
    let  addSql = `INSERT INTO SettingLog(ID, power, session, periodSingle, queryon, queryperiod, time) VALUES(null,?,?,?,?,?,?)`;
    let  addSqlParams = [ sdata.value1, (sdata.options.map( function(item){return item.value} )).indexOf(sdata.value),
    sdata.value2, sdata.value3?1:0, sdata.value4, myDate.toLocaleString( )];
    await ctx.db.query(addSql, addSqlParams);

    ctx.response.body = 'ok';
   
  },
  paraset: async (ctx) => {
    console.log("paraset.");
    const [users] = await ctx.db.query(`SELECT * FROM JewerlyData`);
    let InsertLoc = users.length;
    let  addSql = `INSERT INTO J_EPC(ID,EPC_Number,Type,Location) VALUES(${InsertLoc},?,?,?)`;
    let  addSqlParams = [ctx.request.query.EPC, ctx.request.query['类型'], ctx.request.query['位置'] ];
    await ctx.db.query(addSql, addSqlParams);
    return ctx.body = '珠宝 { EPC：' + ctx.request.query.EPC + ' 类型： '+ ctx.request.query['类型'] +' 位置： ' + ctx.request.query['位置'] + '}----加入数据库';
  }
}