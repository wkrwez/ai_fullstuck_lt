// Foo.prototype.abc = 123

// const Foo = () => {

// }
// console.log();


// Foo.prototype.age = 18;
// function Foo(name) {
//   this.name = name
// }

// let f = new Foo('Tom')

// {name: 'Tom'}  __proto__: {age: 18}


Car.prototype = {
  name: 'BMW',
  height: 1400,
  lang: 4900
}
function Car(color) {
  
  this.color = color
}

let c = new Car('red')
let h = new Car('green')