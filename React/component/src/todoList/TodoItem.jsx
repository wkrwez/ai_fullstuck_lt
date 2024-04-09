import React, { Component } from 'react'

export default class TodoItem extends Component {

  onDel = (index) => {
    this.props.cb(index)
  }

  render() {
    return (
      <ul>
        {
          this.props.list.map((item, index) => (
            <li key={index}>
              <span>{item}</span>
              <button onClick={() => this.onDel(index)}>x</button>
            </li>
          ))
        }
      </ul>
    )
  }
}