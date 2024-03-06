class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(type, name) {
    super(name)
    this.type = type;
  }
}

let c = new Child('child', 'Tom')

console.log(c.name);
