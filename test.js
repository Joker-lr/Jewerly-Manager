var ejs = require("ejs");
var Koa = require('koa');
const mysql = require('mysql2/promise');
var app = new Koa();

//console.log(__dirname);
app.context.view = {};
str = require("fs").readFileSync(__dirname+"/public/test.html","utf8");  //先读文件
app.context.view.str = str;

// 连接数据库
const db = mysql.createPool({
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "1234",
    "database": "jtest"
  })
app.context.db = db;

const main = async (ctx, next) => {
    ctx.body = app.context.view.str;
}

app.use(main);
app.listen(3000,function(){
    console.log("server is running")
})
