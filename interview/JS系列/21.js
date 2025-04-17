let arr = [1, 2, 3, 4, 5, 6];

arr.forEach((i) => {
  console.log(i);
  if (i === 3) {
    throw new Error();
  }
});
