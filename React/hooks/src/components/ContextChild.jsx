import React from 'react';
import { useContext } from 'react';
import Con from '../_context.js';

const ContextChild = () => {
    const msg = useContext(Con)
    return (
        <div>
            ContextChild---{msg}
        </div>
    );
};

export default ContextChild;