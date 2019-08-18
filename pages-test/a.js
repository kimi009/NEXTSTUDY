import { withRouter } from 'next/router'
import styled from 'styled-components'
// import moment from 'moment'
import dynamic from 'next/dynamic'
//动态引入组件，只有渲染到该组件的时间才去加载
const Comp = dynamic(import('../components/comp'))

const Title = styled.h1`
  color: #f26;
  font-size: 40px;
`
const DE = '#ff0'
const A = ({ router, name, time }) => (
  <>
    <a>A {router.query.id}</a>
    <p>{name}</p>
    <p>{name}</p>
    <Title>{time}</Title>
    <Comp />
    <style jsx>{`
      a {
        color: ${DE};
      }
    `}</style>
    <style jsx global>
      {`
        a {
          color: #f00;
        }
      `}
    </style>
  </>
)

A.getInitialProps = async () => {
  // console.log('--------------------')
  //动态引入第三方模块
  const moment = await import('moment')

  const promise = new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'jokcy009009',
        time: moment.default(Date.now() - 60 * 1000).fromNow()
      })
    }, 1000)
  })
  return await promise
}

export default withRouter(A)
