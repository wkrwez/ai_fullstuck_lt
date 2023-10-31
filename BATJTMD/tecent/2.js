//箭头函数 arrow function
const createPhoneNumber=(nums)=>{
    //Array Object join
    //Array ->String
    //replace
    //  nums.join('')
    //字符串拼接 是弟弟
    //架构的感觉  字符串模板    
    let format = "(xxx)xxx-xxxx";//字符串模板
    for(let i=0;i<nums.length;i++){
        format.replace('x',nums[i])//替换
    }
    return format
}
    //  nums.join('').replace(/(\d{3})(\d{3})(\d{4})/,'($1)$2-$3')


console.log(createPhoneNumber([1,2,3,4,5,6,7,8,9,0]))