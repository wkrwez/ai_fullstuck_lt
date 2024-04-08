import React, { Component } from 'react'
import CChild from "./components/C-Child"

export default class CApp extends Component {
  state = {
    msg: '这是父组件的数据'
  }
  fn = () => {
    console.log('parent');
  }

  render() {
    return (
      <div>
        <h2>父组件</h2>

        <CChild msg={this.state.msg} cb={this.fn}/>
      </div>
    )
  }
}
