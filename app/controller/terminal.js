'use strict';


module.exports = {

  ///////盘点参数设置///////////
  queryset: async function(ctx) {
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

  ////////前端珠宝显示页面刷新/////////////
  exirefresh: async function(ctx) {
    console.log("exirefresh.");
    let [ movedata ] = await ctx.db.query( "select * from movelog order by ID desc limit 10" );  /////最新10条变动记录
    let [ jewerlydata ] = await ctx.db.query( "SELECT * FROM jewerlydata" );
    ctx.response.body = {"movedata": movedata, "jewerlydata": jewerlydata };
    // console.log( ctx.response.body )
  } ,

  /////////计算及相关数据存储//////////
  tagloc: async function(ctx) {
    console.log('tagloc.')
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
    let [refertag] = await ctx.db.query('SELECT * FROM ReferenceTag');    //////准备定位算法需要的数据

    let Locdata = await require('../CalLoc.js')(inputdata, refertag);          //////调用定位模块

    let  addSql = `INSERT INTO LocationLog(ID, JewerlyLocation, time) VALUES(null,?,?)`;
    let  addSqlParams = [ JSON.stringify(Locdata), (new Date()).toLocaleString( )];
    await ctx.db.query(addSql, addSqlParams);       //////定位结果存入数据库

    ///////更新珠宝数据表里的位置信息以及记录变动信息记录，速度很慢，需要改善数据库操作
    let movedata = {};
    let [JLupdate] = await ctx.db.query('SELECT * FROM jewerlydata');
    var modSql = 'UPDATE jewerlydata SET Location = ? where EPC_Number = ?';
    for (let item of JLupdate) {
      if ( Locdata[item.EPC_Number] ) {
        if ( item.Location != Locdata[item.EPC_Number][0][0] ) {
          movedata[item.EPC_Number] = {"movebefore" : item.Location , "moveafter" : Locdata[item.EPC_Number][0][0]}
        }
        item.Location = Locdata[item.EPC_Number][0][0];
      } else {
        if ( item.Location ) {
          movedata[item.EPC_Number] = {"movebefore" : item.Location , "moveafter" : "" }
        }
        item.Location = "";
      }
      var modSqlParams = [ item.Location, item.EPC_Number] ;
      await ctx.db.query(modSql, modSqlParams);
    }
    ///////记录位置变动信息
    let  addSql1 = `INSERT INTO movelog(ID, MoveData, time) VALUES(null,?,?)`;
    let  addSqlParams1 = [ JSON.stringify(movedata), (new Date()).toLocaleString( )];
    await ctx.db.query(addSql1, addSqlParams1); 
  } ,

  //////////接收终端数据并存储/////////////
  termdatareceive: async function(ctx) {
    console.log("termdatareceive.");
    let tt = require('fs').readFileSync('./public/testdata/testdata.txt','utf8'); /////模拟数据
    let myDate = new Date();
    let  addSql = `INSERT INTO TerminalData(ID, Termdata, time) VALUES(null,?,?)`;
    let  addSqlParams = [ tt, myDate.toLocaleString( )];
    await ctx.db.query(addSql, addSqlParams);
  } ,

  //////////终端注册并存储注册数据////////
  terminalregister: async function(ctx) {
    console.log("terminalregister");
    let tt = {"mac":"1CCAE33B3C9B","baseTinkerId":"test-base-1.1.2","token":"170976fa8ad1de3981e"};
    const [[regdata]] = await ctx.db.query(`SELECT * FROM terminalmanager where mac = "${tt.mac}"`);
    if(regdata) {
        try {
          regdata.token = tt.token;
          //////更新的baseTinkerId版本及时间
          if (regdata.baseTinkerId) { 
            let temp = JSON.parse(regdata.baseTinkerId); 
            if(temp[temp.length - 1] != tt.baseTinkerId)  {
              temp.push( { "baseTinkerId": tt.baseTinkerId , "time" : (new Date()).toLocaleString( )});
              regdata.baseTinkerId = JSON.stringify( temp );
            }
          } else {
            regdata.baseTinkerId = JSON.stringify( [ { "baseTinkerId": tt.baseTinkerId , "time" : (new Date()).toLocaleString( )} ] ) ;
          }
          //////更新注册ID时间
          if (regdata.RegisterTime) {
            let temp = JSON.parse(regdata.RegisterTime);
            temp.push( (new Date()).toLocaleString() );
            regdata.RegisterTime = JSON.stringify( temp );
          } else {
            regdata.RegisterTime = JSON.stringify( [ (new Date()).toLocaleString() ] );
          }
          ///////更新状态
          if (regdata.status) {
            let temp = JSON.parse(regdata.status) ;
            temp.push( { "status": "上线" , "time" : (new Date()).toLocaleString( )} );
            regdata.status = JSON.stringify( temp );
          } else {
            regdata.status = JSON.stringify( [ { "status": "上线" , "time" : (new Date()).toLocaleString( )} ] );
          }
          ///////存储注册信息
          let  updateSql = `UPDATE terminalmanager SET baseTinkerId=?, token=?, RegisterTime=?, status=? WHERE mac=?`;
          let  updateSqlParams = [ regdata.baseTinkerId, regdata.token, regdata.RegisterTime, regdata.status, tt.mac ];
          await ctx.db.query(updateSql, updateSqlParams);
          //////响应客户端
          ctx.response.body = JSON.stringify( { "type" : "注册ID响应状态码", "data" : { "message" : "success" } } );
      } catch(err) {
        ctx.response.body = JSON.stringify( { "type" : "注册ID响应状态码", "data" : { "message" : "failure" } } );
      }
    } else {
      ctx.response.body = JSON.stringify( { "type" : "注册ID响应状态码", "data" : { "message" : "failure" } } );    /////// 注册ID响应状态码待定
    }
  } ,

  //////////盘点指令发送给终端///////////
  queryemit: async function(ctx) {
    var JPush = require("/Users/Administrator/Desktop/Jewerly-Manager/node_modules/jpush-async/lib/JPush/JPushAsync.js");
    var client = JPush.buildClient('96fbd2efcc3455075640c43f', '37da2da476a8757a445a13e1');

    let [ [ querysetdata ] ] = await ctx.db.query('SELECT * FROM settinglog order by time desc limit 1');
    let [ [ terminalregisterdata ] ] = await ctx.db.query('SELECT * FROM terminalmanager WHERE mac = "1CCAE33B3C9B"');
    let message = { "mac": terminalregisterdata.mac , "cmd": 2000 , "power": querysetdata.power , "readTime": querysetdata.periodSingle, "totalNumber": 1 }
    console.log(JSON.stringify(message));

    client.push().setPlatform('ios', 'android')
    .setAudience(JPush.registration_id('170976fa8ad1de3981e'))
    .setMessage(JSON.stringify(message))
    .setOptions(null, 60)
    .send()
    .then(function(result) {
        console.log(result)
        console.log("ok")
    }).catch(function(err) {
        console.log(err)
        ctx.response.body = err;
    });

  }
}