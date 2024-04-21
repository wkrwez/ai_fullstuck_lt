var characterReplacement = function(s, k) {
    let i = 0
    let j = 0
    let max = 0
    let min=0
    let num = k
    let str = ''  
    let map = {}                              
    while(j<s.length){
        
        if(s[i]===s[j]){
            str =str+ s[i] 
            map[j] +=1
            j++
        }
        if(s[i]!==s[j]&&k==0){
            max = Math.max(str.length,max)
            str = ''
            if(map[j]>2){
                i = j
                min = 0
                k = num
                continue
            }
            i = min
            j = i
            min = 0
            k = num
            map[j] +=1
        }
        if(s[i]!==s[j]&&k>0&&s[j]){
            str =str + s[i]
            k = k-1
            if(min === 0){
                min = Math.max(min,j)   
            }
            map[j] +=1
            j++
        }
        
        
        
    }
    max = Math.max(str.length,max)
    return max
};
let s = "AABABBA", k = 1
console.log(characterReplacement(s,k));