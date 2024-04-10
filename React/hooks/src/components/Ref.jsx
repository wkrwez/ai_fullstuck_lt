import React,{useEffect, useRef} from 'react';

const Ref = () => {

    const h2Ref = useRef(null)//存放DOM的对象

    useEffect(()=>{
        console.log(h2Ref);
    })
    return (
        <div>
            <h2 ref={h2Ref}>Ref</h2>
        </div>
    );
};

export default Ref;