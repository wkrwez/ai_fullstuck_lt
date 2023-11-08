var stack = []     //只有push和pop方法的数组

stack.push('东北大板')
stack.push('钟薛糕')
stack.push('小布丁')
stack.push('巧乐兹')

while(stack.length){
    const top = stack[stack.length-1]
    console.log('我想吃：',top);
    stack.pop()
}