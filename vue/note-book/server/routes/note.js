const Router = require('@koa/router');
const router = new Router();
const { notePublish,findNoteListByType,findNoteDetailById,deleteNote } = require('../controllers/mysqlControl');
const formateDate= require('../utils/index')

router.post('/findNoteListByType', async (ctx) => {
    const { note_type } = ctx.request.body;
   try{
    const res = await findNoteListByType(note_type);
    ctx.body = {
        code: '8000',
        data: res,
        msg: 'success'
    }
   }catch(err){
    ctx.body = {
        code: '8005',
        data: [],
        msg: '服务器异常'
    }
   }
})

//获取笔记
router.get('/findNoteDetailById',async(ctx)=>{
    const {id} = ctx.query;
    console.log(id);
    try{
        const res = await findNoteDetailById(id)
        if(res!==null){
            ctx.body = {
            code: '8000',
            data: res[0],
            msg: 'success'
        }
        }else{
            ctx.body = {
                code: '8000',
                data: res,
                msg: '查找失败'
            }
        }
        
       }catch(err){
        ctx.body = {
            code: '8005',
            data: [],
            msg: '服务器异常'
        }
    }
})

//存笔记
router.post('/notePublish',async(ctx)=>{
    const {
        userId,
        title,
        note_type,
        note_content,
        head_img,
        nickname,
        id
    } = ctx.request.body
    // console.log(ctx.request.body);
//把函数执行的时间拿到，传给数据库存储
    const c_time = formateDate(new Date())
    const m_time = formateDate(new Date())


    try{
        const res = await notePublish([userId,title,note_type,note_content,c_time,m_time,head_img,nickname],id)
            console.log(res);
            if(res.affectedRows !== 0){
                ctx.body = {
                    code:'8000',
                    data:'success',
                    msg:'发布成功'
                }
            }else{
                ctx.body = {
                    code:'8004',
                    data:'fail',
                    msg:'发布失败'
                }
            }
    }catch(err){
        ctx.body = {
            code:'8005',
            data:err,
            msg:'服务端异常'
        }
    }
})

router.post('/deleteNote',async(ctx)=>{
    const {id} = ctx.request.body
    console.log(id);
    try{
        const res = await deleteNote(id)
        console.log(res);
        if(res.affectedRows !== 0){
            ctx.body = {
                code:'8000',
                data:'success',
                msg:'删除成功'
            }
        }else{
            ctx.body = {
                code:'8004',
                data:'fail',
                msg:'删除失败'
            }
        }
    }catch(err){
    ctx.body = {
        code:'8005',
        data:err,
        msg:'服务端异常'
    }
}
})

module.exports = router;
