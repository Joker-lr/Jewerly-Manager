const Koa = require('koa');
const session = require('koa-session2');
const setRouter = require('./app/router.js');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());

// 连接数据库
const db = mysql.createPool({
    "host": "127.0.0.1",
    "port": 3306,
    "user": "root",
    "password": "1234",
    "database": "jtest"
  })
app.context.db = db;

// 设置路由
setRouter(app);


// 错误处理
app.on('error', err => {
    console.log('Server error: ')
    console.dir(err)
})

app.listen(8022);
console.log(`Server Jewerly-Manager listening on port 8022...`)
