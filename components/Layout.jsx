import { useState ,useCallback} from 'react'
import getConfig from 'next/config'
import { Layout,Icon,Input,Avatar,Tooltip,Dropdown,Menu } from 'antd'
import Container from './Container'
import { connect } from 'react-redux'
import { logout } from '../store/store'
import axios from 'axios'
import { withRouter } from 'next/router'
import Link from 'next/link'


const {Header,Content,Footer} = Layout

const { publicRuntimeConfig } = getConfig();

const githubIconStyle = {
  color:'#f70c0c',
  fontSize: 40,
  display:'block',
  paddingTop:10,
  marginRight:20
}

const footStyle = {
  textAlign:'center'
}

const Comp = ({color,children,style})=><div style={{color,...style}}>{children}</div>


const  MyLayout = ({ children,user,logout,router })=> {
  const urlQuery = router.query && router.query.query;

  const [search,setSearch] = useState(urlQuery || '');
  const handlerSearchChange = useCallback((event)=>{
    setSearch(event.target.value)
  },[setSearch])

  //要把search作为依赖
  const handlerOnSearch = useCallback(()=>{
    router.push(`/search?query=${search}`)
  },[search])

  const handlerLogout = useCallback(()=>{
    logout();
    //触发一个acion 页面上登出服务端清除session那么页面上也就没了
  },[logout])

  const handlerGoAuth = useCallback((e)=>{
    e.preventDefault()
    console.log(router)
    axios.get(`/prepare-auth?url=${router.asPath}`).then(resp=>{
      if(resp.status === 200){
        location.href = publicRuntimeConfig.OAUTH_URL
      }else{
        console.log('prepare auth failed',resp)
      }
    }).catch(err=>{
      console.log( `prepare auth failed`,err)
    })
  },[])

  const userDropDown = (
    <Menu>
     <Menu.Item>
     <a href="javascript:void(0)" onClick={handlerLogout}>
        登出
      </a>
     </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner"/>}>
            <div className="header-left">
              <div className="logo">
                <Link href="/">
                  <a href="/">
                    <Icon type="github" style={githubIconStyle}/>
                  </a>
                </Link>
              </div>
              <div>
                <Input.Search placeholder="搜索仓库"
                  value={search}
                  onChange={handlerSearchChange}
                  onSearch={handlerOnSearch}/>
              </div>
            </div>
            <div className="header-right">
              <div>
                {
                  user && user.id ? (
                    <Dropdown overlay={userDropDown}>
                      <a href='/'>
                        <Avatar size={40} src={user.avatar_url}/>
                      </a>
                    </Dropdown>
                  ) : (
                    <Tooltip title="点击登录">
                      <a href={`/prepare-auth?url=${router.asPath}`}>
                        <Avatar size={40} icon='user'/>
                      </a>
                     </Tooltip>
                  )
                }
              </div>
          </div>
        </Container>
      </Header> 
      <Content>
        {/* <Container render={<Comp color="#FF0000" style={{fontSize:40}}/>}>
          {children}
        </Container> */}
        <Container>
          {children}
        </Container>
      </Content>
      <Footer style={footStyle}>
        Developed by kimi
      </Footer>
      <style jsx>{`
        .header-inner{
          display:flex;
          justify-content:space-between;
        }
        .header-left{
          display:flex;
          justify-content:flex-start;
        }
      `}</style>
      <style jsx global>{`
        #__next,
        .ant-layout{
          min-height:100%;
        }
        .ant-layout-header{
          padding-left:0;
          padding-right:0;
        }
        .ant-layout-content{
          background:#ffffff;
          padding-bottom: 80px;
        }
        .ant-layout-footer{
          position:fixed;
          left:0;
          right:0;
          bottom:0
        }
      `}</style>
    </Layout>
  )
}

export default connect(function mapState(state){
  // console.log(101,state)
  return {
    user:state.user
  }
},function mapReducer(dispatch){
  return {
    logout: ()=> dispatch(logout())
  }
})(withRouter(MyLayout))