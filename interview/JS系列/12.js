Person.prototype.getName = function() {
  return this.name;
}
function Person(name) {
  this.name = name;
  return function () {}
}
// let p = new Person('Tom')
// console.log(p);






let p = myNew(Person, 'Tom')
function myNew(...args) { // [Person, 'Tom']
  let obj = {}
  obj.__proto__ = args[0].prototype
  const res = args[0].apply(obj, args.slice(1))
  return (typeof res === 'object' && res !== null) ? res : obj
}
// // console.log(p);
// console.log(p.getName());