//反转字符串方法
let str = 'hello'


// let res = ''
// for(i=str.length-1;i>=0;i--){
//     res +=str[i]
// }
// console.log(res);



// console.log(str.at(1));  //at方法访问数组下标

//数组自带反转方法
/* let arr=[1,2,3,4]
arr.reverse()
console.log(arr);
 */
// 字符串没有这个方法，所以把字符串转成数组

const s = str.split('').reverse().join('')  //''代表字符串每个元素变成独立数组元素（7）    'e'把e切除并分成两个独立数组元素（6.png）


console.log(s);//把数组转成字符串join里面可以写字符串隔开的样式
