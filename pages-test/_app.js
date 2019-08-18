//覆盖next.js app.js
import App, { Container } from 'next/app'
import {Provider} from 'react-redux'
import Layout from '../components/Layout'
import WithRedux from '../lib/withRedux'
import { Button } from 'antd'
import 'antd/dist/antd.css'
// import store from '../store/store'
import MyContext from '../lib/my-context'

//自定义这个app的作用
//1.固定的layout  固定整个页面的布局，
//2.保持一些公用的状态  redux
//3.给具体的页面传入一些自定义的数据
//4.自定义错误处理

class MyApp extends App {
  state = {
    context:'kimi'
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
        <Layout>
          <Provider store={reduxStore}>
            <MyContext.Provider value={this.state.context}>
              <Component {...pageProps} />
              {/* <Button onClick={()=>this.setState({context:`${this.state.context}1`})}>in app add</Button> */}
            </MyContext.Provider>
          </Provider>
        </Layout>
      </Container>
    )
  }
}

export default WithRedux(MyApp)
