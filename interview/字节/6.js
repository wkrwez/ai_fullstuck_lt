let arr = ['1.2','1.34','1.4','3.3.3.3.3.3','6.2']
// [1, 2]  
// [1, 34]
// [1, 4]
// [3, 3, 3, 3, 3, 3]
// [6, 2]


// arr.sort((a, b) => {
//   let pre = a.split('.').map(item => Number(item))
//   let next = b.split('.').map(item => Number(item))

//   console.log(pre, next);
//   let i = Math.max(pre.length, next.length)
//   let j = 0

//   while(j < i) {
//     let num1 = j < pre.length ? pre[j] : 0
//     let num2 = j < next.length ? next[j] : 0

//     if (num1 < num2) {
//       return -1
//     } else if (num1 > num2) {
//       return 1
//     }
//     j++
//   }
//   return 0

// })
// console.log(arr);

// function sortVersions(versions) {
//   return versions.sort((a, b) => {
//       const aParts = a.split('.').map(Number);
//       const bParts = b.split('.').map(Number);

//       for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
//           const numA = i < aParts.length ? aParts[i] : 0;
//           const numB = i < bParts.length ? bParts[i] : 0;

//           if (numA < numB) {
//               return -1; //  从小到大排序
//           } else if (numA > numB) {
//               return 1;
//           }
//       }

//       return 0;
//   });
// }
// console.log(sortVersions(arr));


// 版本号数组

