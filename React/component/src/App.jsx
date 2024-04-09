import List from './components/List'
import Page from './components/Page'
import Life from './components/Life'
import TodoList from './todoList/todoList'


const App = props => {

  const colors = [
    {id:1,name:'red'},
    {id:2,name:'blue'},
    {id:3,name:'black'}
  ]

  return (
    <div>
      <h2>hello react</h2>

      {/* <List colors={colors} fn={function(){}} /> */}

      {/* <Page page={100}/> */}

      {/* <Life/> */}

      <TodoList/>
      
    </div>
  );
};



export default App;