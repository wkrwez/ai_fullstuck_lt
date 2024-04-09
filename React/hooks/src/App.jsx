import React from 'react';
import PropTypes from 'prop-types';
import State from './components/State'
import Effect from './components/Effect'

const App = props => {
  return (
    <div>
      hello world
      {/* <State/> */}
      <Effect/>
    </div>
  );
};

App.propTypes = {
  
};

export default App;