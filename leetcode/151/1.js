const { reverse } = require("dns");

s = "  hello world  "

var reverseWords = function(s) {
    let arr = []
    let res = s.split(" ")

    for(let i = 0;i < res.length; i++){
        if(res[i] !== ''){
            arr.push(res[i])
        }
    }

    return arr.reverse().join(' ')
};

console.log(reverseWords(s));