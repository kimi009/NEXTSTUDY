import { createStore,combineReducers,applyMiddleware} from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {
  count:1
}
const ADD = 'add'

function counterReducer(state=initialState,action){
  // console.log(state,action)
  switch(action.type){
    case ADD:
      //这里必须返回一个新的对象，不能单纯的改属性，要保证两个对象的地址不一样
      //state.count += 1;return state //这种方式是单纯的修改了属性
      return { count: state.count + (action.num || 1)}
    default:
      return state;
  }
}

const userInitialState = {
  username:'kimi'
}
const UPDATE_NAME = 'update_name'
function userReducer(state=userInitialState,action){
  switch(action.type){
    case UPDATE_NAME:
      return{
        ...state,//保证原来的属性不变
        username:action.name
      }
    default:
      return state
  }
}

const allReducer = combineReducers({
  counter:counterReducer,
  user:userReducer
})

const store = createStore(
  allReducer,
  {counter:initialState,user:userInitialState},
  composeWithDevTools(applyMiddleware(ReduxThunk)))
// console.log(store)

//acton create
export function add(num){
  return {
    type:ADD,
    num
  }
}

function addAsync(num){
  return (dispatch,getState,extralParams)=>{
    console.log(58,getState(),extralParams)
    setTimeout(() => {
      dispatch(add(num))
    }, 5000);
  }
}

// store.dispatch({type:ADD})
// store.dispatch(add(3))

store.subscribe(()=>{
  console.log('changed',store.getState())
})
// store.dispatch({type:ADD})
// setTimeout(() => {
//   store.dispatch(addAsync(8))
// }, 2000);

// store.dispatch({type:UPDATE_NAME,name:'009'})

// export default store;

//保证每次服务端渲染都是新的
export default function initialStore(state){
  const store = createStore(
    allReducer,
    Object.assign({},
    {
      counter:initialState,
      user:userInitialState
    },state),
    composeWithDevTools(applyMiddleware(ReduxThunk))
    )
    return store;
}