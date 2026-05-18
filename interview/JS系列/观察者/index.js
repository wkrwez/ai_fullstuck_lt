class Observer {
  constructor(name) {
    this.name = name;
  }
  update() {
    console.log(this.name, "更新了");
  }
}

class Study {
  constructor() {
    this.observerArr = [];
  }
  add(observer, once) {
    this.observerArr.push({ observer, once });
  }
  remove(observer) {
    this.observerArr = this.observerArr.filter(
      (obs) => obs.observer !== observer,
    );
  }
  notify() {
    // 遍历数组副本，防止删除后索引混乱
    [...this.observerArr].forEach((item, index) => {
      item.observer.update();
      if (item.once) {
        this.remove(item.observer);
      }
    });
  }
}

// let a = new Observer("学生");
// let b = new Observer("老师");
// let c = new Study();
// c.add(a, true);
// c.add(b);
// c.notify();
// c.notify();

// 每个观察者都执行了一样的逻辑,为每个观察者单独实现更新逻辑

class Student extends Study {
  update() {
    console.log("开始写作业");
  }
}

let d = new Student("大学生");
let c = new Study();
c.add(d);
c.notify();
