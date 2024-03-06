Parent.prototype.say = 'hello'
function Parent() {
  this.name = 'parent'
  this.car = [1, 2]
}

Child.prototype = new Parent()
function Child() {
  Parent.call(this)
  this.type = 'child'
}

let c = new Child()
let c2 = new Child()

c.car.push(3)

console.log(c2.car);
