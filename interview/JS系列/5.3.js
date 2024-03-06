let obj = {
  a: 1,
  b: {
    n: 2
  },
  c: undefined
}

// const obj2 = structuredClone(obj)

function deepClone(obj) {
  return new Promise((resolve) => {
    const {port1, port2} = new MessageChannel()
    port1.postMessage(obj)
    port2.onmessage = (msg) => {
      resolve(msg.data)
    }
  })
}

let obj2 = null
deepClone(obj).then((res) => {
  // console.log(res);
  obj2 = res

  obj.b.n = 3

  console.log(obj2);
})

