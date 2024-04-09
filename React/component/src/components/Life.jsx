import React, { Component,createRef } from 'react';

class Life extends Component {

    constructor(){
        super()
        // console.log('Life 组件开始加载');
        this.state = {
            count:1
        } 
        this.ref = createRef()
    }

    handlerClick = ()=>{
        this.setState({
            count:this.state.count+1
        })
        // this.state.count++ //正常这样会修改但是不会刷新页面
        // this.forceUpdate()//强制render刷新
    }

    componentDidMount(){
        console.log('Life 组件挂载完成',this.ref.current);
    }

    componentDidUpdate(){
        console.log('life 组件更新完成');
    }

    componentWillUnmount(){
        console.log('life 组件即将卸载');
    }
    //决定组件是否更新,编译前执行
    shouldComponentUpdate(){
        return false
    }

    render() {
        console.log('Life 组件开始编译');
        return (
            <div>
                <h4 ref={this.ref} onClick={()=>this.handlerClick()} >{this.state.count}</h4>
            </div>
        );
    }
}

export default Life;