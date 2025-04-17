let arr = [1, 4, 2, 5, 4, 7, 8, 6];

function quick(arr) {
  if (arr.length <= 1) return arr;

  let mid = arr.splice(0, 1);

  let left = [];
  let right = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= mid) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quick(left).concat(mid, quick(right));
}

console.log(quick(arr));
