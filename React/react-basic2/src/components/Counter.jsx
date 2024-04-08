import React, { Component } from 'react'

class Counter extends Component {
  state = {
    count: 0
  }
  
  setCount = () => {
    this.setState({  // 继承于Component  触发视图更新
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <button onClick={this.setCount}>计数器 -- {this.state.count}</button>
    )
  }
}
 
export default Counter
