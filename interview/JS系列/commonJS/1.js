let count = 0;
let obj = {
  a: 1,
  arr: [1, 2, 3],
};
function changeCount(num) {
  count = num;
}

function changeObj(num) {
  obj.arr.push(num);
}

module.exports = obj;
