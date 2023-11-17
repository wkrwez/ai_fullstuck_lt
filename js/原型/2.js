
// Car.prototype.name = 'BMW'
// Car.prototype.long = 4900   //把this注释掉虽然打印看不到，但是在浏览器上面可以看到1.png
// Car.prototype.height = 1400
//这和上面一样的
Car.prototype = {
    name:'BMW',
    long:4900,
    height:1400
}

function Car(ower,color){
    // this.name = 'BMW'
    // this.long = 4900
    // this.height = 1400
    this.ower = ower
    this.color = color
}

 let car = new Car('李总','red')
let car2 = new Car('戴总','pink')
console.log(car);