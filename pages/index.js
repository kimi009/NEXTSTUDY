import { useEffect } from 'react'
import { Button,Icon,Tabs } from 'antd'
import getConfig from 'next/config'
import { connect} from 'react-redux'
import Router, { withRouter } from 'next/router'
import LRU from 'lru-cache'

import Repo from '../components/Repo'
import { cacheArray } from '../lib//repo-basic-cache'
const cache = new LRU({
  maxAge: 1000 * 60 * 60 * 24
})

const api = require('../lib/api')

const { publicRuntimeConfig } = getConfig()

let cacheUserRepos,cacheUserstarred;

const isServer = typeof window === 'undefined'

function Index({user,userRepos,userStarred,router}){
  // console.log(isLogin,userRepos,userStarred)
  const tabKey = router.query.key || '1'

  const handlerTabChanged = (activeKey)=>{
    Router.push(`/?key=${activeKey}`)
  }

  

  useEffect(()=>{
    if(!isServer){
      // cacheUserRepos = userRepos;
      // cacheUserstarred = userStarred;
      // setTimeout(()=>{
      //   cacheUserRepos = null
      //   cacheUserstarred = null
      // }, 1000*10)
      if(userRepos){
        cache.set('userRepos',userRepos)
      }
      if(userStarred){
        cache.set('userStarred',userStarred)
      }
    }
  },[userRepos,userStarred])

  useEffect(() => {
    console.log(50)
    if(!isServer){
      console.log(51)
      cacheArray(userRepos)
      cacheArray(userStarred)
    }
  });

  if(!user || !user.id){
    return (<div className="root">
      <p>你还没有登录</p>
      <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>登录</Button>
      <style jsx>{`
        .root{
          height:400px;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
        }
        `}

      </style>
    </div>)
  }else{
    // console.log(user)
    return (
      <div className="root">
        <div className="user-info">
          <img src={user.avatar_url} alt="user avatar" className="avatar"/>
          <span className="login">{user.login}</span>
          <span className="name">{user.name}</span>
          <span className="bio">{user.bio}</span>
          <p className="email">
            <Icon type="mail" style={{marginRight:10}}/>
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </p>
        </div>
        <div className="user-repos">
          {/* {
            userRepos.map((repo,key)=><Repo key={key} repo={repo}/>)
          } */}
          <Tabs defaultActiveKey={tabKey} onChange={handlerTabChanged} animated={false}>
            <Tabs.TabPane tab="你的仓库" key="1">
               {
                 userRepos.map((repo)=><Repo key={repo.id} repo={repo}/>)
              }
            </Tabs.TabPane>
            <Tabs.TabPane tab="你关注的仓库" key="2">
               {
                 userStarred.map((repo)=><Repo key={repo.id} repo={repo}/>)
              }
            </Tabs.TabPane>
          </Tabs>
        </div>
        <style jsx>
        {`
          .root{
            display:flex;
            align-items:flex-start;
            padding: 20px 0;
          }
          .user-info{
            width:200px;
            margin-right:40px;
            flex-shrink:0;
            display:flex;
            flex-direction:column;
          }
          .login{
            font-weight:800;
            font-size:20px;
            margin-top:20px;
          }
          .name{
            font-size:16px;
            color:#777;
          }
          .bio{
            margin-top:20px;
            color:#333;
          }
          .avatar{
            width:100%;
            border-radius:5px;
          }
          .user-repos{
            flex-grow:1;
          }
        `}
        </style>
      </div>
    )
  }
  // useEffect(()=>{
  //   // axios.post('/github/test',{test:111})
  // })
}

//getInitialProps调用时机
// 1.客户端页面切换的时候
// 2.服务端渲染如果渲染的是这个页面的时候
Index.getInitialProps = async ({ctx,reduxStore})=>{

  const user = reduxStore.getState().user
  if(!user || !user.id){
    return {}
  }
  if(!isServer){
    //这个东西不该在服务端存在，否则不同的账号可能会公用这个缓存
    // if(cacheUserRepos && cacheUserstarred){
    //   return {
    //     userRepos:cacheUserRepos,
    //     userStarred: cacheUserstarred
    //   }
    // }
    if(cache.get('userRepos') && cache.get('userStarred')){
      return {
        userRepos:cache.get('userRepos'),
        userStarred: cache.get('userStarred')
      }
    }
  }

  const res = await api.request(
    {
      url:'/user/repos'
    },
    ctx.req,
    ctx.res
    )
  const userStarredRes = await api.request({
    url:'/user/starred'
  },ctx.req,ctx.res)


  return {
    userRepos:res.data,
    userStarred: userStarredRes.data
  }
}
//withRouter放在外面，是强制有router变化的时候更新
export default withRouter(connect(
  function mapState(state){
    return {
      user:state.user
    }
  }
)(Index))