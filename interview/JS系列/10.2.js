function Parent(){
    this.name = 'parent';
}

function Child(){
    Parent.call(this)
    this.type = 'child';
}

let c = new Child();

