let obj = {
  a: 1,
  b: "ada",
  [Symbol()]: 123,
  undefined: undefined,
  null: null,
  c: function () {},
};

// const res = Reflect.ownKeys(obj);
// const res = Object.getOwnPropertyNames(obj);
// console.log(res);
// for (let p in obj) {
//   console.log(p);
// }
const res = obj.hasOwnProperty(a);
console.log(a);

// const res = Object.values(obj);
// const res = Object.getOwnPropertySymbols(obj);
// console.log(res);
// var fib = function (n) {
//   const res = [];
//   res[0] = 0;
//   res[1] = 1;
//   for (let i = 2; i <= n; i++) {
//     res[i] = res[i - 1] + res[i - 2];
//   }
//   return res[n];
// };
// console.log(fib(4));
