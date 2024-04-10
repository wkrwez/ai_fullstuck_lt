import React from 'react';
import ContextChild from './ContextChild'
import { useContext } from 'react'; 
import Con from '../_context';

const Context = () => {
  const msg = useContext(Con)

  return (
    <div>
      <h3>context --- {msg}</h3>

      <ContextChild></ContextChild>
    </div>
  );
};

export default Context;