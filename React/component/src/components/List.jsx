import  PropType  from "prop-types";

const List = props => {

    const arr = props.colors
    const lis = arr.map((item,index)=><li key={index}>{item.name}</li>)

    return (
        <div>
            this is a list
            <ul>
                {lis}
            </ul>
            <p>props的默认值</p>
        </div>
    );
};

List.propTypes = { //在为组件添加校验规则
    colors:PropType.array,
    fn:PropType.func.isRequired, //必须传isRequired
    obj:PropType.shape({
        name:PropType.number
    })
    
}

export default List;