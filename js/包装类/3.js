//对象的创建
//下面两种创建方法完全没区别

var obj1 = {}  //对象字面量

var obj2 = new Object();  //构造函数


//第三种，自定义构造函数
function Car(color){
    this.color = color
  this.name = 'BMW'
  this.height = 1400        //this是对象(this.name  obj.name)
  this.lang = 4900
  this.weight = 1000
}
let car = new Car('green')    /* 如果没有let car = new Car()，没有return值，直接打印Car()会表示undefined。car为实例对象 == this */
let car2 = new Car('pink')    /* new 相当于创建了一个var this={}并添加了属性，return this ；new一次就会得到一个新的对象*/
//  console.log(car);
car.name = '劳斯莱斯'
console.log(car);       //改了名字，car2不受影响
console.log(car2);