var generateParenthesis = function(n) {
    let arr = []
    let len = n*2
    function back(left,right,s){
        if(s.length === len){
            arr.push(s)
            return
        }
        if(left>0){
            back(left-1,right,s+'(')
        }
        if(right>left){
            back(left,right-1,s+')')
        }

    }
    back(n,n,'')
    return arr
};



console.log(generateParenthesis(3));