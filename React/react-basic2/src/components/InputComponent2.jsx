import React, { Component,createRef } from 'react';

//非受控组件
class InputComponent2 extends Component {
    msgRef = createRef() //创建一个存放dom的容器

    changeHandler = () =>{
        console.log(this.msgRef.current.value);
    }

    render() {
        return (
            <div>
                <input type="text" ref={this.msgRef}/>
                <button onClick={this.changeHandler}>提交</button>
            </div>
        );
    }
}

export default InputComponent2;