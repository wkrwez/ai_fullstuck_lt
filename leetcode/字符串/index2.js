let str = 'yesasey'

/* function isPalindrome(s){
    const res = s.split('').reverse().join('')
    return res===s
   

}
 */

function isPalindrome(s){
   let i = 0,j = str.length-1;
   while(i<=j){
    if(s[i]===s[j]){
    i++;
    j--

    }else{
        return false    
    }
    }

   return true

}
console.log(isPalindrome(str));




