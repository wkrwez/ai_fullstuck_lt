  Car.prototype.name = 'BMW'
  Car.prototype.long = 4900   
  Car.prototype.height = 1400



function Car(ower,color){
    this.ower = ower
    this.color = color
    //   this.name = 'BMW'
    //  this.long = 4900
    //  this.height = 1400
}

 let car = new Car('李总','red')
let car2 = new Car('戴总','pink')//实例对象

 car.name = '奔驰'
 delete Car.prototype.name
 delete car.name
console.log(car);
console.log(car2);
console.log(Car.prototype.name);