class Parent {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(type, name, age) {
    super(name, age); //深度继承
    this.type = type;
  }
}

let c = new Child("child", "Tom", 20);

console.log(c.age);
