import ExitComponent from './components/ExitComponent';
import ClassComponent from './components/ClassComponent'
import './App.css'
//根组件

const songs = [
  {id:1,name:'录制'},
  {id:2,name:'阿达'},
  {id:3,name:'官方'}
]

const flag = true
const styleObj = {
  color:'blue'
}

const showGreen = true

function App() {
  return (
    <div className="App">
{/* 循环显示列表 */}
      <h2>hello world</h2>
      <ul>
        {
          songs.map(item =>{
            //需要返回值
            return <li key={item.id}>{item.name}</li>
          })
        }
      </ul>
{/* 是否显示 */}
      <h3>{
            flag ? 'react' : 'vue'
          }
      </h3>
      {flag && <a href="#">哈哈哈哈</a>}
{/* 写样式 */}
      <h2 style={{color:'red'}} >红色字体</h2>
      <h2 style={styleObj} >蓝色字体</h2>
      <h2 className={showGreen ? 'green' : ''}>绿色字体</h2>
      <ExitComponent/>
      <hr/>
      <ClassComponent/>
    </div>
  );
}

export default App;
