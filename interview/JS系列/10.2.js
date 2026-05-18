Parent.prototype.say = "hello";
function Parent() {
  this.name = "parent";
  this.car = [1, 2];
}

function Child() {
  Parent.call(this); //绑定this，无法继承原型上的属性
  this.type = "child";
}

let c = new Child();
c.car.push(3);
console.log(c.say, c.car);
