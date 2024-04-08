// import React, { Component } from 'react'
// export default class CChild extends Component {
//   render() {
//     return (
//       <div>
//         <h4>子组件</h4>
//         <p>{this.props.msg}</p>
//       </div>
//     )
//   }
// }


function CChild(props) {
    console.log(props);
    // props.msg = '修改父组件传递的值'
  
    props.cb()
  
    return (
      <div>
        <h4>子组件</h4>
        <p>{props.msg}</p>
      </div>
    )
  }
  export default CChild