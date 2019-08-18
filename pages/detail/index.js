// import Repo from '../../components/Repo'
// import Link from 'next/link'
// import api from '../../lib/api'


// function makeQuery(queryObj){
//   const query = Object.entries(queryObj).reduce((res,entry)=>{
//     result.push(entry.join('='))
//     return result;
//   },[]).join('&')

//   return `?${query}`
// }

// function Detail({repoBasic,router}){

//   const  query = makeQuery(router.query)
//   return (
//     <div className="root">
//       <div className="repo-basic">
//         <Repo repo={repoBasic}/>
//         <div className="tabs">
//           <Link href={`/detail${query}`}>
//             <a className="tab index">ReadMe</a>
//           </Link>
//           <Link href={`/detail/issues${query}`}>
//             <a className="tab issues">Issues</a>
//           </Link>
//         </div>
//       </div>
//       <div></div>
//       <style jsx>
//       {`
//         .root{
//           padding-top: 20px;
//         }
//         .repo-basic{
//           padding: 20px;
//           border: 1px solid #eee;
//           margin-bottom: 20px;
//           border-radius:5px;
//         }
//         .tab + .tab{
//           margin-left: 20px;
//         }
//       `}
//       </style>
//     </div>
//   )
// }

// Detail.getInitialProps = async ({ctx})=>{
//   const {owner,name} = ctx.query;
//   let res = await api.request({
//     url:`/repos/${owner}/${name}`
//   },ctx.req,ctx.res)
//   return {
//     repoBasic: res.data
//   }
// }

import withRepoBasic from '../../components/with-repo-basic'

const Detail =  ({text})=> <span>detail {text}</span>


Detail.getInitialProps = async ()=>{
  return {
    text:123
  }
}

export default withRepoBasic(Detail,'index')