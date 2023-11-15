/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
        let arr=[-1]
        for(var i=0;i<needle.length;i++){
            for(var j=0;j<haystack.length;j++){
               if(needle[i]==haystack[j]){
                arr=j;
               }
               
            }
           
        }
       
            for(var t=1;t<arr.len1;t++){
                if(arr[0]>arr[t]){
                    var c=0
                    c =arr[0]
                    arr[0]=arr[t]
                    arr[t]=c
            }
            return arr[0]
                
            
        }
        return arr;
        
};
