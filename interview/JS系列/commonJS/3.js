const { count, obj } = require("./1.js");

// console.log(obj);

function add(a, b) {
  throw a + b;
}
const promise = new Promise((resolve, reject) => {
  const res = add(1, 2);
  resolve(res);
}).then(
  (res) => console.log(res),
  (reason) => console.log(reason),
);
