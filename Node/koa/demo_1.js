const http = require('http')  //commonJS

//跑一个进程    放业务逻辑
const server = http.createServer((req,res)=>{ //前端请求，后端响应
    console.log(req);
}) 

server.listen(3000,()=>{
    console.log('项目跑起来了');
})
