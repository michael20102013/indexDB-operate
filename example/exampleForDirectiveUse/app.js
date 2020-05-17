const Koa = require('koa');
const serve = require('koa-static')
const path = require('path')
const Router = require('koa-router')

const home = serve(path.resolve(__dirname, './'))

const app = new Koa();
const router = new Router()
router.get('*', (ctx, next) => {
    ctx.body = 'hello world'
})

app.use(home)

app.use(router.routes())
    .use(router.allowedMethods())


app.listen(3009, () => {
    console.log('server is started at port 3000')
})