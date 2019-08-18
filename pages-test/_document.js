import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
//只有在服务端渲染的时候才能调用
//用来修改服务端渲染的文档内容
//一般用来配合第三方css-in-js方案使用

//HOC
// function withLog(Comp) {
//   return props => {
//     // console.log(props)
//     return <Comp {...props} />
//   }
// }

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    console.log('document')
    // console.log(7, ctx)
    const sheet = new ServerStyleSheet()
    //1.这里采用的是react的HOC的方式，可以重新包装APP和所有渲染的组件
    const originalRendPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRendPage({
          //APP挂载样式
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
          //
          // enhanceComponent: Component => withLog(Component)
        })
        //因为覆盖了Document  所以要重新返回页面的props
      const props = await Document.getInitialProps(ctx)
      // console.log(sheet.getStyleElement())
      return {
        ...props,
        styles: (
          <>
            {/* next.js原生的style样式 */}
            {props.styles}
            {/* 通过styled-compoent生成的样式 */}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
