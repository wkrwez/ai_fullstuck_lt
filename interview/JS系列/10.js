// function Car(name) {
//   this.name = name
// }
// Car.prototype.run = function(){ console.log("run");}
// Car.sell = function(){
//   console.log('sell');
// }
// let car = new Car('BMW')
// car.run()


class Car {
  constructor(name) {
    this.name = name
  }
  run() {
    console.log('running');
  }
  static sell() {
    console.log('sell');
  }
}
let car = new Car('BMW')
// car.sell()
car.run()
console.log(car);   //Array.from()  Array.isArray([])  
