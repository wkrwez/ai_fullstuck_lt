let obj = {
  a: 1,
  b: {
    n: 2
  },
  c: undefined,
  d: Symbol('hello'),
  e: function() {}
}
// obj.c = obj.b
// obj.b.n = obj.c
// let newObj = JSON.parse(JSON.stringify(obj))
// // obj.b.n = 3

let obj2 = deepCopy(obj)

function deepCopy(obj) {
  let newObj = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] !== 'object' || obj[key] === null) { // 原始类型
        newObj[key] = obj[key]
      } else {
        newObj[key] = deepCopy(obj[key])  // {n: 2}
      }
    }
  }

  return newObj
}

console.log(obj2);