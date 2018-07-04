var ejs = require("ejs");
var Koa = require('koa');
var app = new Koa();

console.log(__dirname);
app.context.view = {};
str = require("fs").readFileSync(__dirname+"/views/01.ejs","utf8");  //先读文件
Nm = '01'
app.context.view.Nm = str;

const main = async (ctx, next) => {
    ctx.body = ejs.render(ctx.view.Nm, {names:['测试数据B','测试数据C','test']});
}

app.use(main);
app.listen(3000,function(){
    console.log("server is running")
})
