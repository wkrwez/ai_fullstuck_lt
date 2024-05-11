import {React,useState} from 'react';


const Son = ({onGetSongMsg}) => {

    const sonMsg = 'this is son msg'
    return (
        <div>
            this is Son
            <button onClick={()=>{onGetSongMsg(sonMsg)}}>sendMsg</button>
        </div>
    );
};

function Father(){
    const [value,setValue] = useState('')
    const getMsg = (msg) =>{
        console.log(msg);
        setValue(msg)
    }
    return (
        <div>
            this is Father
            <span>{value}</span>
            <Son onGetSongMsg={getMsg}/>
        </div>
    )
}

export default Father;