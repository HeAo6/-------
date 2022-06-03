// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init( {env: 'cloud1-6g57yqtg9389de25'})

const TcbRouter = require('tcb-router')
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const app = new TcbRouter({event})

    app.router('list',async(ctx,next)=>{
        const keyword = event.keyword
        let w = {}
        if (keyword.trim() !== '') {
            w = {
                content: db.RegExp({
                    regexp: keyword,
                    options:'i'
                })
            }
        }

      let blogList = await db.collection('blog').where(w).skip(event.start).limit(event.count)
        .orderBy('createTime','desc').get().then((res)=>{
            return res.data
        })
        ctx.body = blogList
    })





    return app.serve()
}