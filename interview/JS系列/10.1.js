function Car(color, speed) {
  this.color = color;
  this.speed = speed;
  this.seat = [1, 2];
}

Truck.prototype = new Car("red", 200);
function Truck() {
  this.container = true;
}

let truck = new Truck();
let truck2 = new Truck();

// truck.seat.push(3)
// console.log(truck2.seat);
// console.log(truck.speed);

function Person(name, age) {
  this.age = age;
  this.name = name;
  this.arr = [1, 2];
}

function Talk() {
  this.task = "talk";
}

Talk.prototype = new Person("lisa", 18);

let talk = new Talk("你好");
talk.arr.push(3);
console.log(talk.arr, talk.name);
