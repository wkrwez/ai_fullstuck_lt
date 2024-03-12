
function* gen(){

}

function generatorToAwait(generatorFn){
    return function(){
        return new Promise(function(resolve, reject){
            function loop(key,arg){
                const {value, done} = g[key]
                if(done){
                    resolve(value);
                }else{
                    
                }

            }
        })
    }
}

let asyncFn = generatorToAwait(gen());