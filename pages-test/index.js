// import { Button } from 'antd'
// import Router from 'next/router'
// import Link from 'next/link'
import {useEffect} from 'react'
import axios from 'axios'
//看清楚这里的写法
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
// import store from '../store/store'
import { connect } from 'react-redux'
import { add }from '../store/store'

const Index = ({counter,username,add,rename}) => {
  // function gotoTestB() {
  //   Router.push(
  //     {
  //       pathname: '/test/b',
  //       query: {
  //         id: 39
  //       }
  //     },
  //     '/test/b/39'
  //   )
  // }
  const events = [
    'routeChangeStart',
    'routeChangeComplete',
    'routeChangeError',
    'beforeHistoryChange',
    'hashChangeStart',
    'hashChangeComplete'
  ]
  function maskEvent(type) {
    return (...args) => {
      console.log(type, ...args)
    }
  }
  // events.forEach(event => {
  //   Router.events.on(event, maskEvent(event))
  // })

  useEffect(()=>{
    axios.get('/api/user/info').then(resp=>{
      console.log(resp)
    })
  },[])
  ///空数组是只会触发一次

  return (
    <>
      <span>Index</span>
      <p>{counter}</p>
      <p>{username}</p>
      <input value={username} onChange={e=>rename(e.target.value)}/>
      <button onClick={()=>add(counter)}>store add</button>
      {/* <pre>烦死了副经理是否解决</pre>
      <kbd>fjsdlfjs</kbd><br/>
      <cite>范德萨发的</cite>
      <big>价格&yen;22&nbsp;</big>
      <tt>测试df</tt> */}
      {/* <Link href="/a?id=3">
        <Button>button</Button>
      </Link>
      <Button onClick={gotoTestB}>Go B</Button> */}
      <a href={publicRuntimeConfig.OAUTH_URL}>去登录</a>
    </>
  )
}

Index.getInitialProps = async ({reduxStore})=>{
  reduxStore.dispatch(add(5))
  return {}
}

//connect 里面的方式是帮助我们映射store里面的东西到组件里
export default connect(function mapStateToProps(state){
  return {
    counter:state.counter.count,
    username:state.user.username
  }
},function mapDispatchToProps(dispatch){
  return {
    add:(num)=>dispatch({type:'add',num}),
    rename:(name)=>dispatch({type:'update_name',name})
  }
})(Index)