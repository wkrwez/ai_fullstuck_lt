let a = 123



function reverseNum(num){
    // let str1 = ''

    // const str = num.toString()
    // for(let i = 0;i < str.length;i++){

    //     str1 = str[i] + str1
    // }
    // return Number(str1)
    return +(num.toString().split('').reverse().join(''))
}
console.log(reverseNum(a));