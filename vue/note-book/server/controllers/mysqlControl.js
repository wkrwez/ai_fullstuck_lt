//封装连接mysql的函数

const mysql = require('mysql2')
const config = require('../config/index.js')

//创建线程池
const pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password:config.database.PASSWORD ,
    database: config.database.DATABASE,
    port: config.database.PORT
})

//连接mysql
const allServer = {
    query:function(sql,values){
        //连接线程池
        return new Promise((resolve,reject)=>{
            pool.getConnection((err,connection)=>{
                if(err){
                    reject(err)
                }else{
                    //执行mysql语句
                    connection.query(sql,values,(err,rows)=>{
                        if(err){//sql错误
                            reject(err)
                        }else{
                            resolve(rows)
                        }
                        connection.release()//释放线程池连接
                    })
                }
            })
        })
    }
}

//检查登陆密码
const userLogin = (username,password)=>{
    let _sql = `select * from users where username="${username}" and password="${password}";`
    return allServer.query(_sql)
}


//查询注册账号是否相同
const userFind = (username)=>{
    let _sql = `select * from users where username="${username}";`
    return allServer.query(_sql)
} 

//存储新账号
const userPut = (username,password,nickname)=>{
    let _sql = `insert into users(username, password,nickname) VALUES ("${username}","${password}","${nickname}");`
    return allServer.query(_sql)
}

//根据type查找日记列表
const findNoteListByType = (type) => {
    let _sql = `select * from note where note_type='${type}';`
    return allServer.query(_sql)
}

const findNoteDetailById = (id)=>{
    let _sql = `select * from note where id='${id}';`
    return allServer.query(_sql)
}
module.exports = {
    userLogin,
    userFind,
    userPut,
    findNoteListByType,
    findNoteDetailById
}