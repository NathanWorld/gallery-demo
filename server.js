//const Koa = require('koa')
//const { resolve } = require('path')
//const serve = require('koa-static')

/*
 * 利用 babel-node 代替 node 来启动代码，来支持 ES6
 * 再用 nodemon --exec 来运行 yarn start 命令实现热更新
 */
import Koa from 'koa'
import { resolve } from 'path'
import serve from 'koa-static'

const app = new Koa()
app.use(serve(resolve(__dirname, './')))
app.listen(3000)
