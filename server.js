const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const auth = require('./server/auth')
const api = require('./server/api')
const koaBody = require('koa-body')

// const Redis = require('ioredis')
const RedisSessionStore = require('./server/session-store')
//判断是否是出于开发模式
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
///处理http请求
const handle = app.getRequestHandler()

const option = {
  port: 6379,
  host: '203.195.150.105',
  password: 'CHENSHUYE009chenshuye009'
}
// const redis = new Redis(option)

//等待pages页面内容编译完成
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()
  
  server.use(koaBody())

  server.keys = ['Kimi Bolg Study']
  const SESSION_CONFIG = {
    key: 'bolgID',
    maxAge: 2 * 24 * 60 * 60 * 1000//过期时间
//     store: new RedisSessionStore(redis)
  }

  server.use(session(SESSION_CONFIG, server))
  //配置处理github oAuth登录
  auth(server)
  api(server)
  // server.use(async (ctx, next) => {
  //   if (!ctx.session.user) {
  //     ctx.session.user = {
  //       name: 'kimi',
  //       age:18
  //     }
  //   } else {
  //     console.log(`session is ${ctx.session}`)
  //   }
  //   await next()
  // })

  // router.get('/set/user', async ctx => {
  //   let session = ctx.session
  //   if (!session || !session.user) {
  //     ctx.session.user = {
  //       name: 'kimi',
  //       age: 18
  //     }
  //     ctx.body = 'set session success'
  //   } else {
  //     ctx.body = 'session already exist'
  //   }
  // })

  // router.get('/del/user', async ctx => {
  //   //当session等于null就会调用redis的destroy
  //   ctx.session = null
  //   ctx.body = 'del session success'
  // })

  // router.get('/api/user/info', async ctx => {
  //   const user = ctx.session.userInfo;
  //   if(!user){
  //     ctx.status = 401;
  //     ctx.body = 'Need Login'
  //   }else{
  //     ctx.body = user
  //     ctx.set('Content-Type','application/json')
  //   }
  // })

  router.get('/a/:id', async ctx => {
    // console.log(16, ctx.params)
    const id = ctx.params.id
    await handle(ctx.req, ctx.res, {
      pathname: '/a',
      query: { id }
    })
    //意思是我们自己处理body的response, 不需要koa来处理
    ctx.respond = false
  })
  server.use(router.routes())

  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session;
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('start ok port 3000')
  })
})
