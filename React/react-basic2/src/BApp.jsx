import React from 'react';
import BrotherA from './components/BrotherA'
import BrotherB from './components/BrotherB'

// const { Provider, Consumer } = React.createContext() // 创建一个上下文对象
import { Provider } from './provider.js'


class BApp extends React.Component {
  state = {
    message: 'hello'
  }

  fn = (newMsg) => {
    console.log(newMsg);
    // message = newMsg
    this.setState({message: newMsg});
  }

  render() {
    return (
      <Provider value={this.state.message}>
        <div>
          <h2>父组件</h2>
          {/* <BrotherA cb={this.fn}/>
          <BrotherB message={this.state.message}/> */}

          <BrotherB/>
        </div>
      </Provider>
      
    );
  }
  
}

export default BApp;