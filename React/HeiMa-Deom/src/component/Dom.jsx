import {React,useRef,useState} from 'react';
//useRef生成ref对象 绑定到dom标签身上
// dom可用时，ref.current获取<DOM>
// 渲染完毕之后dom生成之后才可用

// const Dom = () => {
//     const inputRef = useRef(null)
//     const showDom = () =>{
//         console.dir(inputRef.current);
//     }
//     return (
//         <div>
//             <input type="text" ref={inputRef} />
//             <button onClick={showDom}>获取Dom</button>
//         </div>
//     );
// };


//聚焦输入框
const Dom = () => {
    const [value,setValue] = useState('')
    const inputRef = useRef(null)
    const isFocus = () =>{
        setValue('')
        inputRef.current.focus()
    }
    return (
        <div>
            <input type="text" 
            value={value} 
            ref={inputRef} 
            onChange={(e)=>setValue(e.target.value)}
            />
            <button onClick={isFocus}>聚焦</button>
        </div>
    );
};


export default Dom;