import React from 'react';

// const { Provider, Consumer } = React.createContext() // 创建一个上下文对象
import { Consumer } from '../provider.js'

const BrotherB = props => {
  return (
    <Consumer>
      {
        value => (
          <div>
            <h4>子组件B -- {value}</h4>
          </div>
        )
      }
    </Consumer>
    
  );
};

export default BrotherB;