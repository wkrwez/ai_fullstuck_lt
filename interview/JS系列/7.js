function add(a, b, c) {
  return a + b + c;
}
// add(1, 2, 3);

function curry(fn) {
  return (foo = (...args) => {
    if (args.length >= fn.length) return fn(...args);

    return (...arg) => foo(...args, ...arg);
  });
}
let res = curry(add);
console.log(res(1)(2)(3));

// function add(a) {
//   return function(b) {
//     return function(c) {
//       return a + b + c;
//     }
//   }
// }
// const res = add(1)(2)(3)

// console.log(res);
// function add(a, b, c) {
//   return a + b + c;
// }

// function curry(fn) {
//   return function curried(...args) {
//     if (args.length >= fn.length) {
//       return fn(...args);
//     } else {
//       return function (...nextArgs) {
//         return curried(...args, ...nextArgs);
//       };
//     }
//   };
// }

// let res = curry(add);
// console.log(res(1)(2)(3)); // 输出: 6
