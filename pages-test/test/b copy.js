import { useState, useReducer,useContext,useRef, useLayoutEffect, useEffect } from 'react'
import MyContext from '../../lib/my-context'
function countReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state + 1
    case 'minus':
      return state - 1
    default:
      return state
  }
}

function invoiceReducer(state,action){
  switch(action.type){
    case 'changeInvType':
      let res =  Object.assign({},{invType:state.invType + 3})
      return res;
      // console.log(state.invType)
      // state.invType += 3;
      // console.log(state)
      // return state;
      default:
        return state;
  }
}

function MyCountFunc() {
  const [count, dispatchCount] = useReducer(countReducer, 0)
  const [name, setName] = useState('kimi')
  const [invoice,dispatchInvoice] = useReducer(invoiceReducer,{invType:0})
  const context = useContext(MyContext)

  const inputRef = useRef();
  useEffect(()=>{
    console.log(invoice)
  },[invoice.invType])
  // const [count, addCount] = useState(0)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // addCount(count => count + 1)
  //     dispatchCount({ type: 'minus' })
  //   }, 1000)
  //   return () => clearInterval(interval)
  // }, [])
  useEffect(() => {
    // console.log('effect invoked')
    console.log(inputRef)
    return () => console.log('effect deteched')
  }, [])
  //执行时间在DOM挂载之前执行,如果像下面那样有很大的计算量的话会把页面卡死
  // useLayoutEffect(() => {
  //   console.log('useLayoutEffect invoked')
  //   let i = 0;
  //   for (let index = 0; index < Math.pow(10,100); index++) {
  //     i+= index;
  //    }
  //    console.log(i)
  //   return () => console.log('useLayoutEffect deteched')
  // }, [count])

  return (
    <>
      <div>
        <input ref={inputRef} value={name} onChange={e => setName(e.target.value)} />
      </div>
      <p>{context}</p>
      <button onClick={()=>dispatchInvoice({type:'changeInvType'})}>{invoice.invType}</button>
      <button onClick={() => dispatchCount({ type: 'add' })}>{count}</button>
    </>
  )
}

export default MyCountFunc
