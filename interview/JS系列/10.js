class Car{
    constructor(name){ //构造器显示继承
        this.name = name;
    }
    run(){  //这种放在原型
        // console.log(`${this.name} is running`);
    
    }
    static sell(){   //静态方法相对于Car.sell  
        console.log('sell');
    }
}
// Car.prototype.sell = function(){console.log('sell');}//挂在原型上，能被car访问

// Car.sell = function(){console.log('sell');}
let car  = new Car('BMW');

car.run()
car.sell()
console.log(car);