import React from 'react';

function Son(props){
    //props:对象
    console.log(props);
    
    return <div>this is son {props.sys},jsx:{props.child}</div>
}

const Father = () => {
    const name = 'this is app name'
    return (
        <div>
            <Son name={name} 
                age={18}
                isTrue={false}
                list={['vue','react']}
                obj={{name:'liutao'}}
                fn={()=>{}}
                sys={NaN}
                child={<span>45</span>}
            >
                <span>"this is mySon"</span>
            </Son>
        </div>
    );
};

export default Father;