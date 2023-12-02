// setTimeout(()=>{
//     console.log(1);
// },1000)

// console.log(2);

console.time('myTimer')
for(let i=0;i<100000;i++){
   if(i=99999){
    console.log(i);
   }
}

console.timeEnd('myTimer')