'use strict';


module.exports = {
  paraget: async (ctx, next) => {
    console.log("paraset.");
    const [users] = await ctx.db.query(`SELECT * FROM J_EPC`);
    return ctx.body = users;
  },
  paraset: async (ctx, next) => {
    console.log("paraget.");
    const [users] = await ctx.db.query(`SELECT * FROM J_EPC`);
    let InsertLoc = users.length;
    let  addSql = `INSERT INTO J_EPC(ID,EPC_Number,J_Type,Location) VALUES(${InsertLoc},?,?,?)`;
    let  addSqlParams = [ctx.request.query.EPC, ctx.request.query['类型'], ctx.request.query['位置'] ];
    await ctx.db.query(addSql, addSqlParams);
  }
}