const withCss = require('@zeit/next-css')
const config = require('./config')

const configs = {
  //编译文件的输出目录
  distDir: 'dest',
  //是否给每个路由生成ETag
  generateEtags: false, //因为有了nginx ,这个字段决定是否调用浏览器缓存
  //页面内容缓存配置
  onDemandEntries: {
    //内容在内棕中缓存的时长
    maxInactiveAge: 25 * 1000,
    //同事缓存的页面数目
    pagesBufferLength: 2
  },
  //在pages目录下那种后缀文件会被认为是页面
  pageExtensions: ['jsx', 'js'],
  //配置buildId
  generateBuildId: async () => {
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID
    }
    //返回null使用默认的unique_id
    return null
  },
  //手动修改webpack config
  webpack(config, options) {
    return config
  },
  //修改webpackdevmiddleaware
  webpackDevMiddleware: config => {
    return config
  },
  //可以在页面上通过process.env.customKey 获取value
  env: {
    customKey: 'value'
  },
  //下面两个要通过next/config来读取
  //只有在服务端渲染才会获取的配置
  serverRuntimeConfig: {
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET
  },
  //在服务端渲染和客户端渲染都可以读取的配置
  publicRuntimeConfig: {
    staticFolder: '/static'
  }
}

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}
//修改默认的next的配置文件，
//withCss 会帮助生成一个配置文件


module.exports = withCss({
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
    OAUTH_URL: config.OAUTH_URL
  }
})
