# 基本数据类型之间的转换
1. 转布尔
2. 转数字
3. 转字符串
4. 转对象



# 对象转原始类型     obj.toString()     obj.valueOf()
{}.toString()//"[object Object]"
toString() 在js中有多个版本：
- 数组的toString()会将数组中的所有元素转换成字符串并以逗号隔开
- 函数的toString()会将整个函数体以字符串形式返回
- Date的toString()会将整个Date以字符串形式返回


## 对象转字符串   ToPrimitive(obj,String) 
1. 判断obj是基本类型，则返回
2. 否则调用toString方法，如果得到原始类型，则返回
3. 否则调用valueOf方法，如果得到原始类型，则返回
4. 否则报类型错误

## 对象转数字   ToPrimitive(obj,Number)
1. 判断obj是基本类型，则返回
2. 否则调用valueOf方法，如果得到原始类型，则返回
3. 否则调用toString方法，如果得到原始类型，则返回
4. 否则报类型错误


# 一元运算符

# 二元运算符
lprim = ToPrimitive(v1)
rprim = ToPrimitive(v2)

v1 + v2 === lprim + rprim

1. 如果lprim是字符串或者rprim是字符串，则返回将不是字符串的一方转为字符串，再进行拼接
2. 否则都转换成Number进行加法运算

# == 相等 