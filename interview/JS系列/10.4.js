let parent = {
  name: 'Tom',
  firends: ['foo', 'bar', 'baz'],
  age() {
    return 18
  }
}

let child = Object.create(parent)
let child2= Object.create(parent)

child.firends.push('xyz')
child.add = '增加'
console.log(child);
// console.log(child2.add);
// console.log(child2);