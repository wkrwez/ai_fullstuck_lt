const ExitComponent = () => {
    const list = [
        {id:1,name:'react'},
        {id:2,name:'vue'},
    ]

const onDel = (id) =>{

}

    return (
      <div>
        <p>这是一个额外的组件</p>
        <ul>
            {
                list.map(item => (
                    <li key = {item.id}>
                        <span>{item.name}</span>
                        <button onClick={() => onDel(item.id)}>x</button>
                    </li>
                ))
            }
        </ul>
      </div>
    );
  };
  
  export default ExitComponent;