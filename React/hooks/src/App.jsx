import React,{useContext} from 'react';
import PropTypes from 'prop-types';
import State from './components/State'
import Effect from './components/Effect'
import MyHooks from './components/MyHooks';
import Context from './components/Context';
import Con from './_context.js';
import {Button} from 'antd'


const App = props => {
  const Context = useContext()
  return (
    <Con.Provider value={'来自App的数据'}>
      <div>
        hello world
      <Context/>
      </div>
      <Button>antd</Button>
    </Con.Provider>
  );
};

App.propTypes = {
  
};

export default App;