Object.prototype.abc = 123
let obj = {
  a: 1,
  b: {
    n: 2
  }
}

let obj2 = shallowCopy(obj)


function shallowCopy(obj) {
  let newObj = {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key]
    }
    
  }
  return newObj
}

// obj.b.n = 3

console.log(obj2);