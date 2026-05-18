// function Person(age) {
//   this.instance = null;
//   this.age = age;
// }

// Person.prototype.getAge = function () {
//   console.log(this.age);
// };

// Person.getInstance = function (age) {
//   if (this.instance) {
//     return this.instance;
//   }
//   return (this.instance = new Person(age));
// };

// let a = Person.getInstance(17);
// let b = Person.getInstance(18);
// // console.log(a === b);
// console.log(a.getAge(), b.getAge());
/*******************普通单例*********************** */
// let Person = (function () {
//   let instance = null;
//   return function (name) {
//     if (instance) {
//       return instance;
//     }
//     this.name = name;
//     return (instance = this);
//   };
// })();

// Person.prototype.getName = function () {
//   return this.name;
// };

// let a = new Person("lisa");
// let b = new Person("jon");
// console.log(b.getName());

/**************代理单例************************************** */
// 实现单一职责
// let Person = (function () {
//   let instance = null;
//   return function (name) {
//     if (instance) {
//       return instance;
//     }
//     return (instance = new HandelPerson(name));
//   };
// })();

// function HandelPerson(name) {
//   this.name = name;
// }

// HandelPerson.prototype.getName = function () {
//   return this.name;
// };
// let a = new Person("lisa");
// let b = new Person("jon");
// console.log(a.getName(), b.getName());

/**************惰性代理（单一弹窗）************************ */
let Person = function (fn) {
  let instance = null;
  return function (name) {
    if (instance) {
      return instance;
    }
    return (instance = fn.call(this, name));
  };
};

function createSon(name) {
  this.name = name;
  return this.name;
}

let a = Person(createSon);
let b = a("lisa");
let c = a("json");
console.log(b === c);
