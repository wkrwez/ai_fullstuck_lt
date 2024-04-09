import React,{useEffect,useState} from 'react';
import PropTypes from 'prop-types';

const Effect = props => {

    const [count,setCount] = useState(0)
    const [name,setName] = useState('Tom')

    useEffect(()=>{
        // console.log(`触发${count}`);
        const timer = setTimeout(()=>{
            setCount(count+1)
        },1000)
        return ()=>{
            //清除副作用
            clearTimeout(timer)
        }
    },[count])

    return (
        <div>
            <button onClick={()=> setCount(count+1)}>{count}</button>
            <button onClick={()=> setName('Jerry')}>{name}</button>
        </div>
    );
};

Effect.propTypes = {
    
};

export default Effect;