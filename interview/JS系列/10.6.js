function Parent(){
    this.name = 'parent';
}
Child.prototype = new Parent()
function Child(){
    Parent.call(this)
    this.type = 'child';
}

let c = new Child();
