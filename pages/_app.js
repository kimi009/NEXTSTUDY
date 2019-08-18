//覆盖next.js app.js
import App, { Container } from 'next/app'
import {Provider} from 'react-redux'
import Layout from '../components/Layout'
import WithRedux from '../lib/withRedux'
import PageLoading from '../components/PageLoading'
import 'antd/dist/antd.css'
import Link from 'next/link'
import axios from 'axios'
import Router from 'next/router'

//自定义这个app的作用
//1.固定的layout  固定整个页面的布局，
//2.保持一些公用的状态  redux
//3.给具体的页面传入一些自定义的数据
//4.自定义错误处理

class MyApp extends App {
  state = {
    context:'kimi',
    loading:false
  }

  startLoadinng = ()=>{
    this.setState({
      loading:true
    })
  }

  stopLoadinng = ()=>{
    this.setState({
      loading:false
    })
  }

  componentDidMount(){
    Router.events.on('routeChangeStart',this.startLoadinng)
    Router.events.on('routeChangeComplete',this.stopLoadinng)
    Router.events.on('routeChangeError',this.stopLoadinng)
    // axios.get('/github/search/repositories?q=react').then(resp=>{
    //   console.log(resp)
    // })
  }

  componentWillUnmount(){
    Router.events.off('routeChangeStart',this.startLoadinng)
    Router.events.off('routeChangeComplete',this.stopLoadinng)
    Router.events.off('routeChangeError',this.stopLoadinng)
  }

  //检测指定的页面是否有getInitialProps
  static async getInitialProps( ctx ) {
    const { Component } = ctx;
    // console.log('app')
    // console.log(ctx)
    let pageProps = {}
    //因为自定义了这个app所以就要手动调用组件的getInitialProps
    //不是每个页面都有getInitialProps
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    // console.log(pageProps)
    return {
      pageProps
    }
  }
  render() {
    console.log('app')
    const { Component, pageProps,reduxStore} = this.props
    return (
      <Container>
          <Provider store={reduxStore}>
            {this.state.loading ? <PageLoading/> : null}
            {this.state.isElectron ?  <Component {...pageProps} /> : 
            <Layout>
                {/* <Link href='/'>
                  <a>Index</a>
                </Link>
                <br/>
                <Link href='/detail'>
                  <a>Detail</a>
                </Link> */}
                <Component {...pageProps} />
              </Layout>
            }
          </Provider>
      </Container>
    )
  }
}

export default WithRedux(MyApp)
