// Parent.prototype.say = 'hello'
// function Parent() {
//   this.name = 'parent'
//   this.car = [1, 2]
// }

// Child.prototype = new Parent()
// function Child() {
//   Parent.call(this)
//   this.type = 'child'
//   // this.car = [1, 2]

// }

// let c = new Child()
// let c2 = new Child()

// c.car.push(3)
// c.add = 1

// // console.log(c2.car);
// // console.log(c.car);
// console.log(c2);
Parent.prototype.say = "你长大了";
function Parent(name, age) {
  this.name = name;
  this.age = age;
  this.arr = [1, 2];
}
Child.prototype = new Parent();
function Child(name, age) {
  Parent.call(this, name, age);
}

let child = new Child("小王", 10);
let child2 = new Child("小王", 10);
child.arr.push(3);
console.log(child2.arr);
