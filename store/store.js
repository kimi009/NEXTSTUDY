import { createStore,combineReducers,applyMiddleware} from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import axios from 'axios'
const userInitialState = {}

const LOGOUT = 'LOGOUT'

function userReducer(state=userInitialState,action){
  switch(action.type){
    case LOGOUT:{
      return {}
    }
    default:
      return state
  }
}

export function logout(){
  return dispatch=>{
    axios.post('/logout').then(resp=>{
      if(resp.status === 200){
        dispatch({type:LOGOUT})
      }else{
        console.log(`logout failed ${resp}`)
      }
    }).catch(err=>{
      console.log(`logout failed ${err}`)
    })
  }
}

const allReducer = combineReducers({
  user:userReducer
})

//保证每次服务端渲染都是新的
export default function initialStore(state){
  const store = createStore(
    allReducer,
    Object.assign({},
    {
      user:userInitialState
    },state),
    composeWithDevTools(applyMiddleware(ReduxThunk))
    )
    return store;
}