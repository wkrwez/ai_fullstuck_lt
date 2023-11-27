/**
 * @param {number} n
 * @return {number}
 */
var tribonacci = function (n) {

    if (n == 0) {
        return 0;
    } else if (n < 3) {
        return 1;
    }
    let arr = [0, 1, 1];
    for (let i = 3; i <= n; i++) {
        arr = [arr[1], arr[2], arr[1] + arr[2] + arr[0]];
    }
    return arr[2];
};
console.log(tribonacci(6));

// arr=[1,1,1,1]
// for(var i=0;i<4;i++){
// arr = [arr[0],arr[1],arr[2],arr[3]+arr[2]]
// }


// console.log(arr);

