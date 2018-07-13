'use strict';


module.exports = {

  ///////盘点参数设置///////////
  queryset: async (ctx) => {
    console.log("queryset.");
    // const [data] = await ctx.db.query(`SELECT * FROM SettingLog`);
    let sdata = ctx.request.body;
    let myDate = new Date();
    let  addSql = `INSERT INTO SettingLog(ID, power, session, periodSingle, queryon, queryperiod, time) VALUES(null,?,?,?,?,?,?)`;
    let  addSqlParams = [ sdata.value1, (sdata.options.map( function(item){return item.value} )).indexOf(sdata.value),
    sdata.value2, sdata.value3?1:0, sdata.value4, myDate.toLocaleString( )];
    await ctx.db.query(addSql, addSqlParams);

    ctx.response.body = 'ok';
   
  } ,

  /////////终端数据整理给定位算法模块//////////
  datatirm: async function(ctx) {
    console.log('datatrim.')
    let tt = require('fs').readFileSync('./public/testdata/testdata.txt','utf8'); /////模拟数据
    let rawdata = JSON.parse(tt);
    let testdata = rawdata.data.tags;
    let inputdata = {};
    for (let item of testdata) {
      let a ={};
      a[item.antenna] = item.count;
      if (inputdata[`${item.tagId}`]) {
          inputdata[`${item.tagId}`].push(a);
      } else {
          inputdata[`${item.tagId}`] = [a];
      }
    }

  } ,

  //////////接收终端数据并存储/////////////
  termdatareceive: async function(ctx) {
    console.log("termdatareceive.");
    let tt = require('fs').readFileSync('./public/testdata/testdata.txt','utf8'); /////模拟数据
    let myDate = new Date();
    let  addSql = `INSERT INTO TerminalData(ID, Termdata, time) VALUES(null,?,?)`;
    let  addSqlParams = [ tt, myDate.toLocaleString( )];
    await ctx.db.query(addSql, addSqlParams);
  }
}