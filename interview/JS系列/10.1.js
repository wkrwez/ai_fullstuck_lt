function Car(color, speed) {
  this.color = color
  this.speed = speed
  this.seat = [1, 2]
}

Truck.prototype = new Car('red', 200)
function Truck() {
  this.container = true
}


let truck = new Truck()
let truck2 = new Truck()


// truck.seat.push(3)
// console.log(truck2.seat);
