//处理在getInitalProps 请求问题 ，这里要注意在服务端是commonjs规范不支持export的
const axios = require('axios')
const github_base_url = 'https://api.github.com'
const isServer = typeof window === 'undefined'

async function requestGithub(method,url,data,headers){
  return await axios({
    method,
    url:`${github_base_url}${url}`,
    data,
    headers
  })
}
//req  res只有服务端才有
async function request({method='GET',url,data={},headers},req,res){
  if(!url){
    throw Error('url must provide')
  }
  if(isServer){
    const session = req.session;
    const githubAuth = session.githubAuth || {}
    const headers = {}
    if(githubAuth.access_token){
      headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
    }
    return await requestGithub(method,url,data,headers)
  }else{
    //下面的代码会最终到koa的中间件server/api里面去，最终到requestGithub上面
    //客户端时请求自己的koa服务
    return await axios({
      method,
      url:`/github${url}`,
      data
    })
  }
}

module.exports = {
  request,
  requestGithub
}