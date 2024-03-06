Parent.prototype.say = 'hello'
function Parent(like) {
  this.name = 'parent'
  this.like = like
}

Child.prototype = Object.create(Parent.prototype) // {__proto__: Parent.prototype} 
Child.prototype.constructor = Child
function Child(like) {
  Parent.call(this, like)
  this.type = 'child'
}


let c1 = new Child('coding')

console.log(c1.say);