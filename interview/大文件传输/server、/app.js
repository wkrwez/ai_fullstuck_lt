const http = require('http')
const multiparty = require('multiparty')//解析前端的formData数据
const path = require('path')
const fse = require('fs-extra')

const UPLOAD_DIR = path.resolve(__dirname,'.','chunks')
// console.log(UPLOAD_DIR); 创建文件夹


const pipeStream = (filePath,writeStream)=>{
    return new Promise((resolve,reject)=>{
        const readStream = fse.createReadStream(filePath) //将切片读成流
        readStream.on('end',()=>{
            fse.unlinkSync(filePath) //移除切片
            resolve()
        })
        readStream.pipe(writeStream)// 汇入到可写流
    })
}

//合并前解析前端传过来的参数
const resolvePost = (req)=>{
    return new Promise((resolve,reject)=>{
        let chunk= ''
        req.on('data',(data)=>{
            chunk +=data
        })
        req.on('end',()=>{
            resolve(JSON.parse(chunk))
        })
    })
}

const mergeFileChunks = async(filePath,fileName,size)=>{
    // 读取filePath路径下所有的切片
    const chunks =await fse.readdir(filePath)

    // 防止切片顺序错乱
    chunks.sort((a,b)=>a.split('-')[1] - b.split('-')[1])

    // 转换成流类型才能合并
    // fse.mkdirsSync(path.resolve(filePath,fileName))  //合成文件的地方
    const arr = chunks.map((chunkPath,index)=>{
        return pipeStream(
            path.resolve(filePath,chunkPath),
            // 创建可写的流
            fse.createWriteStream(path.resolve(filePath,fileName),{
                start:index * size,
                end:(index + 1) *size
            })
        )
    })
    await Promise.all(arr)
}

const server = http.createServer(async(req,res)=>{
    //解决跨域 所有请求源和请求体都能请求
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','*')
    if (req.method === 'OPTIONS') {
        res.status = 200
        res.end()
        return
    }
    //前端切片
    if(req.url === '/upload'){
        const form = new multiparty.Form()
        form.parse(req,(err,fields,files)=>{
            res.writeHead(200, { 'content-type': 'text/plain' });
            res.write('received upload:\n\n');
            if(err){
                console.log(err);
                return
            }
            //切片内容
            const file = files.file[0] 
            const fileName = fields.fileName[0]
            const chunkName = fields.chunkName[0]

            // 将切片存起来 先创建文件夹
            const chunkDir = path.resolve(UPLOAD_DIR,`${fileName}-chunks`)
            if(!fse.existsSync(UPLOAD_DIR)){
                fse.mkdirsSync(UPLOAD_DIR)
            }
            // 将切片写入到文件夹
            fse.moveSync(file.path,`${UPLOAD_DIR}/${chunkName}`)

            res.end('切片上传成功')
        })
        
    }else if(req.url === '/merge'){
        // 合并切片
        const {fileName,size} =await resolvePost(req) //解析前端传过来的参数
        // const filePath = path.resolve(UPLOAD_DIR,`${fileName}-chunks`)
        // console.log(filePath);
        await mergeFileChunks(UPLOAD_DIR,fileName,size)

        res.end('合并成功')
    }
})



server.listen(3000,()=>{
    console.log('服务端启动了');
})