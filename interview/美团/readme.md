# 1.Number 和 parseInt

- Number 将任意类型的值转为数字

  1. 如果字符串中包含无效数字表示（小数点有效，但是 12.12.56 无效数字），则无效 NaN，undefined 为 NaN

- parseInt 将字符串转为数字

  1. 字符串包含非数字会提取数字，数字需要在前面
  2. 进制转换失败为 NaN，支持 2~36 进制

- 解析方式：
  Number：严格解析，整个字符串必须是有效的数字，否则返回 NaN。
  parseInt：从字符串中提取数字，直到遇到非数字字符，可以解析部分有效的数字（遍历查找）。
- 支持的数字类型：
  Number：支持浮点数。
  parseInt：仅支持整数。
- 基数支持：
  Number：不支持指定基数。
  parseInt：支持指定基数，默认为 10 进制。

# 2. 数组去重

let arr = [1,2,3,5,1,2,4]

1.  用 ES6 的 Set
2.  let res = arr.filter(( target , index , array) => {
    array.indexOf(traget) === index
    })
    ---- array 是调用 filter 方法的数组
3.  arr.reduce((acc,target)=>{
    if(!acc.includes(target)){
    acc.push(target)
    }
    return acc
    },[])  
    ----acc 初始赋值为[]

# 3.判断对象为{}
