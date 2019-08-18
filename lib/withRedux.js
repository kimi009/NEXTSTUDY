import React from 'react'
import CreateStore from '../store/store'
//判断是否是服务端
const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState){
  if(isServer){
    //服务端每次都是创建一个新的
    return CreateStore(initialState)
  }
  if(!window[__NEXT_REDUX_STORE__]){
    //客户端要保证唯一性
    window[__NEXT_REDUX_STORE__] = CreateStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__];
}

export default (Comp)=>{
  class WithReduxApp extends React.Component{
    constructor(props){
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }
  
    render(){
      const {Component,pageProps,...rest} = this.props;
      // console.log(Component,pageProps,rest)
      if(pageProps){//不是每个页面都有pageProps
        pageProps.test = '自定义HOC'
      }    
      return <Comp 
        Component={Component} 
        pageProps={pageProps} 
        {...rest} 
        reduxStore={this.reduxStore}
      />
    }
  }
  // TestHocComp.getInitialProps = Comp.getInitialProps;
  WithReduxApp.getInitialProps = async (ctx)=>{
    let reduxStore;
    if(isServer){
      const { req } = ctx.ctx;
      const session = req.session;
      // console.log(session)
      if(session && session.userInfo){
        reduxStore = getOrCreateStore({
          user: session.userInfo
        })
      }else{
        reduxStore = getOrCreateStore();
      }
    }else{
      reduxStore = getOrCreateStore();
    }
    
    //这里每次切换页面都会执行，一定要保证客户端只有一个store
    // const reduxStore = getOrCreateStore()
    ctx.reduxStore = reduxStore;

    let appProps = {};
    if(typeof Comp.getInitialProps === 'function'){
      appProps = await Comp.getInitialProps(ctx)
    }
    
    return {
      ...appProps,
      initialReduxState:reduxStore.getState()
    }
  }
  return WithReduxApp;
}