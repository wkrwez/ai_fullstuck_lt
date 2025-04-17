let obj = {
  a: 1,
  [Symbol()]: 123,
  [Symbol()]: 1234,
  c: [1, 2, 3],
};

// delete obj.a;

let newObj = structuredClone(obj);
// console.log(obj);
try {
  const clonedObj = structuredClone(obj);
  console.log(clonedObj);
} catch (error) {
  console.error(error);
}
// console.log(newObj);
