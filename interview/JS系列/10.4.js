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

console.log(child2.firends);