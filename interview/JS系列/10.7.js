class Parent {
  constructor(name) {
    this.name = name;
    this.age = 18;
  }
  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(type, name) {
    super(name)  //深度继承
    this.type = type;
  }
}

let c = new Child('child', 'Tom')

console.log(c.age);
