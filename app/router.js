'use strict';
const Router = require('koa-router');
const path = require('path');
const fs = require('fs');
const koaStatic = require('koa-static');
const send = require('koa-send')

/**
 * @param app - Koa case
 * @param router - Koa router
 */

module.exports = app => {
    const router = new Router({
    });

    // 映射静态资源
    app.use(
        koaStatic(path.join(__dirname, '../public'))
    )

    // 把路由映射到js文件
    for(let fname of fs.readdirSync(__dirname + '/controller')) {
        let appModule = require('./controller/' + fname);
        let name = fname.split('.');
        Object.keys(appModule).forEach(method => {
        router.all(`/${name[0]}/${method}`, appModule[method]);
        })
    }
    
    // 首页
    // router.all('/', async (ctx, next) => {
    //     try {
    //     await send(ctx, '../public/index.html')
    //     } catch (err) {
    //     if (err.status !== 404) {
    //         throw err
    //     }
    //     }
    // })

    // 应用路由
    app.use(router.routes())
    .use(router.allowedMethods())
}