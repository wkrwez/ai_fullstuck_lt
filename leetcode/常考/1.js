let line = ['192.168.1.1','192.168.1.2','192.168.1.2','192.168.1.1']

const findMost = (arr)=>{
    let max = 0
    let map = {}
    let val = ''
    let res = []
    for(let i = 0;i<arr.length;i++){
        let item = arr[i]
        if(map[item]){
            map[item] = map[item]+1
            if(map[item] > max ){
                max = map[item]
                val = item
                
            }
        }else{
            map[item] = 1
        }
    }
    return val
}
findMost(line)
    