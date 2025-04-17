// let a = {
//   value: 0,
//   [Symbol.toPrimitive]() {
//     ++this.value;
//     return this.value;
//   },
// };
// console.log(a == 1 && a == 2 && a == 3);

// if (a == 1 && a == 2 && a == 3) {
//   console.log("hello");
// }

function gurrp(fn) {
  let grup = (...args) => {
    if (fn.length === args.length) return fn(...args);
    return (...args2) => grup(...args, ...args2); //把所有参数拼接在一起
  };
  return grup;
}

function add(a, b, c) {
  return a + b + c;
}

let curry = gurrp(add);

console.log(curry(1)(2)(3));
