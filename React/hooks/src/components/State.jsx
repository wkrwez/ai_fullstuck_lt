import React ,{useState}from 'react';
import PropTypes from 'prop-types';


const State = props => {
    const [count,setCount] = useState(10)
    const [title,setTitle] = useState('hello')
    let num = 1
    if(num){
        var [flag,setFlag] = useState('true')
    }


    const add = () =>{
        setCount(count+1)  
        setTitle(title + count)
    }

    return (
        <div>
            <h4>title:{title}</h4>
            <button onClick={()=> add()}>{count}</button>
            <h2>{flag}</h2>
        </div>
    );
};

State.propTypes = {
    
};

export default State;