// import React, { Component } from 'react'
// import TodoItem from './TodoItem'

// export default class TodoList extends Component {
//   state = {
//     list: ['html', 'css', 'js'],
//     inputVal: '',
//     inputRef:createRef()
//   }

//   handlerChange = (e) => {
//     // console.log(e.target.value);
//     this.setState({
//       inputVal: e.target.value
//     })
//   }
//   handlerClick = () => {
//     // this.state.list.push(this.state.inputVal)
//     // console.log(this.state.list);
//     // let arr = this.state.list
//     // arr.push(this.state.inputVal)
//     this.setState({
//       list: [...this.state.list, this.state.inputVal]
//     })
//   }

//   render() {
//     return (
//       <div>
//         <header>
//           <input type="text" value={this.state.inputVal} onChange={this.handlerChange} />
//           <button onClick={this.handlerClick}>提交</button>
//         </header>

//         <section>
//           <TodoItem list={this.state.list}/>
//         </section>
//       </div>
//     )
//   }
// }
import React, { Component, createRef } from 'react'
import TodoItem from './TodoItem'

export default class TodoList extends Component {
  inputRef = createRef()
  state = {
    list: ['html', 'css', 'js'],
    inputVal: ''
  }

  handlerChange = (e) => {
    // console.log(e.target.value);
    this.setState({
      inputVal: e.target.value
    })
  }
  handlerClick = () => {
    // this.state.list.push(this.state.inputVal)
    // console.log(this.state.list);
    // let arr = this.state.list
    // arr.push(this.state.inputVal)
    // this.setState({
    //   list: [...this.state.list, this.state.inputVal]
    // })
    // console.log(this.inputRef.current.value);
    this.setState({
      list: [...this.state.list, this.inputRef.current.value]
    })
  }

  handlerDel = (index) => {
    console.log(index);
    let arr = this.state.list
    arr.splice(index, 1)
    this.setState({
      list: arr
    })
  }


  render() {
    return (
      <div>
        <header>
          {/* <input type="text" value={this.state.inputVal} onChange={this.handlerChange} /> */}
          <input type="text" ref={this.inputRef}/>
          <button onClick={this.handlerClick}>提交</button>
        </header>

        <section>
          <TodoItem list={this.state.list} cb={this.handlerDel}/>
        </section>
      </div>
    )
  }
}