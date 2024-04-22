var romanToInt = function(s) {
    if(!s.length)return 0
    let map = {
        'IV':4,
        'IX':9,
        'XL':40,
        'XC':90,
        'CD':400,
        'CM':900,
        'I':1,
        'V':5,
        'X':10,
        'L':50,
        'C':100,
        'D':500,
        'M':1000
    }

    let i =0
    let j = 1
    let sum = 0
    let str = ''
    while(i<s.length){
        str = s[i] + s[j]
        if(map[str]){
            sum += map[str]
            console.log(sum,111);
            i+=2
            j+=2
        }else{
            sum += map[s[i]]
            console.log(sum,222);
            i++
            j++
        }
    }
    return sum
};
romanToInt('LVIII')