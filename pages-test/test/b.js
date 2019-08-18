import { useState, useReducer,memo,useMemo,useCallback, useRef } from 'react'
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
function MyCountFunc() {
  const [count, dispatchCount] = useReducer(countReducer, 0)
  const [name, setName] = useState('kimi')
  
  const countRef = useRef();
  countRef.current = count;

  const config = useMemo(()=>({
    text:`count is ${count}`,
    color: count > 3 ? 'red' :'blue'
  }),[count])
  
  //他只是依赖dispatchCount这个方法不会变化所以数组里面不需要加依赖
  // const handleButtonClick = useCallback(()=>dispatchCount({type:'add'}),[])
  const handleButtonClick = useMemo(()=>()=>dispatchCount({type:'add'}),[])
  //所以useCallback就是useMemo的简化版

  const handlerAlert = ()=>{
    setTimeout(() => {
      alert(countRef.current)
    }, 2000);
  }

  return (
    <>
      <div>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      <Child 
      config={config}
      onButtonClick={handleButtonClick}/>
      <button onClick={handlerAlert}>handlerAlert</button>
    </>
  )
}
const Child = memo(function Child({onButtonClick,config}){
  console.log('child render')
  return(
    <button onClick={onButtonClick} style={{color:config.color}}>
      {config.text}
    </button>
  )
})
export default MyCountFunc
