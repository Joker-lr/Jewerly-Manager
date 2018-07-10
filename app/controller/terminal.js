'use strict';

const ejs = require('ejs');

module.exports = {
  paraget: async (ctx, next) => {
    console.log("paraget.");
    const [users] = await ctx.db.query(`SELECT * FROM JewerlyData`);
    return ctx.body = ejs.render(ctx.view['JewerlyExibition'], {users});
  },
  paraset: async (ctx, next) => {
    console.log("paraset.");
    const [users] = await ctx.db.query(`SELECT * FROM JewerlyData`);
    let InsertLoc = users.length;
    let  addSql = `INSERT INTO J_EPC(ID,EPC_Number,J_Type,Location) VALUES(${InsertLoc},?,?,?)`;
    let  addSqlParams = [ctx.request.query.EPC, ctx.request.query['类型'], ctx.request.query['位置'] ];
    await ctx.db.query(addSql, addSqlParams);
    return ctx.body = '珠宝 { EPC：' + ctx.request.query.EPC + ' 类型： '+ ctx.request.query['类型'] +' 位置： ' + ctx.request.query['位置'] + '}----加入数据库';
  }
}