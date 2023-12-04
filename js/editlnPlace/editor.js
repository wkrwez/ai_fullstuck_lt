/**
 * @func EditInPlace组件
 * @param {string} id 元素id
 * @param {dom} parent 挂载点
 * @return {string} value 初始值
 */
 

function EditInPlace(id,parent,value){
   this.id = id;
   this.parentElement = parent;
   this.value = value||'default  value';
   this.createElement(this.id);
   this.attachEvents();
}

EditInPlace.prototype = {
    //创建组件的DOM，并挂载到挂载点上
    createElement:function(id){
        // console.log(this,'---');
        //动态创建DOM 当前对象的containerElement属性
        //DOM树状结构
    this.containerElement = document.createElement('div');
    //span节点的创建
    this.staticElement = document.createElement('span');
    this.staticElement.innerText = this.value;
    this.containerElement.appendChild(this.staticElement);

    //输入框的创建
    this.fieldElement = document.createElement('input');
    this.fieldElement.type = 'text'
    this.fieldElement.value = this.value;
    this.parentElement.appendChild( this.fieldElement)
    
    //保存按钮
    this.saveButton = document.createElement('input')
    this.saveButton.type = 'button';
    this.saveButton.value = 'Save';
    this.containerElement.appendChild(this.saveButton);

    //取消按钮
    this.cancelButton = document.createElement('input')
    this.cancelButton.type = 'button';
    this.cancelButton.value = 'Cancel';
    this.containerElement.appendChild(this.cancelButton);

 
    this.parentElement.appendChild(this.containerElement);
    this.convertToText();//切换到文本状态

    },
    //切换到文本状态
    convertToText:function(){
        this.fieldElement.style.display = 'none';
        this.saveButton.style.display = 'none';
        this.cancelButton.style.display = 'none';
        this.staticElement.style.display = 'inline';
        
    },
    attachEvents:function(){
        // let that = this;//对象实例保存下来了
        // this.staticElement.addEventListener('click',()=>{
        //     //this被覆盖
        //     console.log(this,this.cancelButton);
        //     console.log(that,that.cancelButton);
        //     //拿到 对象的this 怎么办？
        // })
        const fn = this.convertToEditable.bind(this)
        this.staticElement.addEventListener('click',fn)

        this.cancelButton.addEventListener('click',this.convertToText.bind(this))
        this.saveButton.addEventListener('click',this.save.bind(this))
        // fn();
    },
    convertToEditable:function(){
        // console.log(this,this.cancelButton);
        this.fieldElement.style.display = 'inline';
        this.saveButton.style.display = 'inline';
        this.cancelButton.style.display = 'inline';
        this.staticElement.style.display = 'none';
    },
    save:function(){
        let value = this.fieldElement.value;
        this.value = value;
        this.staticElement.innerText = value;
        this.convertToText();
    }
}
