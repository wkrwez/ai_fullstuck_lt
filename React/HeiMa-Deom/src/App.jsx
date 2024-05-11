import {React,useState} from 'react';
import Dom from './component/Dom';
import Father from './component/Props/Father-Son';
import Son from './component/Props/Son-Father';

const App = () => {

  // const [value,setValue] = useState('')

  return (
    <div>
      <Son/>
    </div>
    // <div>
    //   <input
    //     value={value}
    //     onChange={(e) =>setValue(e.target.value)}
    //     type="text" />
    //     <input
    //     value={value}
        
    //     type="text" />
    // </div>
  );
};

export default App;