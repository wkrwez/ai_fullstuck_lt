var str = '([{}])'

function isValid(s){
    const obj = {   //obj['']取值方法
        '(':')',
        '[':']',
        '{':'}'
    }
   const stack = []
   
   const len = s.length

   for(let i= 0; i<s.length;i++){
    if(s[i]=='('||s[i]=='['||s[i]=='{'){
        stack.push(s[i])
    }else{  //取到右括号
        if(!stack.length||obj[stack.pop()]!==s[i]){
          return false
        }
           //pop可以获取删除的值
    }
   }
   return !stack.length
} 
console.log(isValid(str));   //true