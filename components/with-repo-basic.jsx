import {useEffect} from 'react'
import Repo from './Repo'
import Link from 'next/link'
import api from '../lib/api'
import {withRouter} from 'next/router'
import {get,cache } from '../lib/repo-basic-cache'

const isServer = typeof window === 'undefined'

export default (Comp,type="index")=>{

  function makeQuery(queryObj){
    const query = Object.entries(queryObj).reduce((result,entry)=>{
      result.push(entry.join('='))
      return result;
    },[]).join('&')
  
    return `?${query}`
  }

  function WithDetail({repoBasic,router,...rest}){
    const  query = makeQuery(router.query)

    useEffect(()=>{
      if(!isServer){
        cache(repoBasic)
      }
    })

    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic}/>
          <div className="tabs">
            {type === 'index' ? <span className="tab">ReadMe</span> : <Link href={`/detail${query}`}>
              <a className="tab index">ReadMe</a>
            </Link>}
            {type === 'issues' ? <span className="tab">Issues</span> :
            <Link href={`/detail/issues${query}`}>
              <a className="tab issues">Issues</a>
            </Link>}
          </div>
        </div>
        <Comp {...rest}/>
        <style jsx>
        {`
          .root{
            padding-top: 20px;
          }
          .repo-basic{
            padding: 20px;
            border: 1px solid #eee;
            margin-bottom: 20px;
            border-radius:5px;
          }
          .tab + .tab{
            margin-left: 20px;
          }
        `}
        </style>
      </div>
    )
  }

  
  WithDetail.getInitialProps = async (context)=>{
    const {router,ctx} = context;
    const {owner,name} = ctx.query;

    const full_name = `${owner}/${name}`
    let pageData = {}
    if(Comp.getInitialProps){
      pageData = await Comp.getInitialProps(context)
    }
    const cacheContent = get(full_name);
    console.log(76,cacheContent)
    if(cacheContent){
      return {
        repoBasic: cacheContent,
        ...pageData
      }
    }else{
      console.log(333)
      let res = await api.request({
        url:`/repos/${owner}/${name}`
      },ctx.req,ctx.res)
      return {
        repoBasic: res.data,
        ...pageData
      }
    }
}
 return withRouter(WithDetail);
}