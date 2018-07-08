var ejs = require("ejs");
var Koa = require('koa');
var app = new Koa();

//console.log(__dirname);
app.context.view = {};
str = require("fs").readFileSync(__dirname+"/public/test.html","utf8");  //先读文件
app.context.view.str = str;

const main = async (ctx, next) => {
    ctx.body = app.context.view.str;
}

app.use(main);
app.listen(3000,function(){
    console.log("server is running")
})
