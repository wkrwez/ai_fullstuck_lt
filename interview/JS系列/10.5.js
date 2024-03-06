let parent = {
  name: 'Tom',
  firends: ['foo', 'bar', 'baz'],
  age() {
    return 18
  }
}

function clone(origin) {
  let obj = Object.create(origin)
  obj.like = function() {
    return ['coding']
  }
  return obj
}

let child = clone(parent)

