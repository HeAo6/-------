// 云函数入口文件
const cloud = require('wx-server-sdk')
const tcbRouter = require('tcb-router')
const rq = require('request-promise')

const BASE_URL = 'http://dadian.store'
cloud.init({
  env: 'cloud1-6g57yqtg9389de25'
})

//绑定数据库
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new tcbRouter({event})   //使用tcbRouter
  //第一个参数为调用云函数的时候，需要指定的名称
  app.router('playlist', async(ctx,next) =>{
   //数据需要返回
   ctx.body = await db.collection("playlist")
   .skip(event.start).limit(event.count)     //从第几条开始取 取到第几条
   .orderBy("creatTime",'desc')
   .get().then(res=>{
     return res.data
   });
  })
   //开始匹配云函数得路由规则
  app.router('musicList',async(ctx,next) =>{
    //封装路径
    const url = BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId)
    //返回数据
   ctx.body = await rq({
     url,
     method:'POST',
     headers:{
      cookie:'MUSIC_U=8d43a2dab7fd20340f2d02a97a9e3f97be5547e2a1fe5363930e5be21d0870de993166e004087dd31b59ccf8aa0c9f7f6938202879c04433337cbfe7a3348df9e79df6fb90795662a0d2166338885bd7'
     }
   })
   .then((res)=>{
      return JSON.parse(res)
    })
  })
   
  app.router('musicUrl',async(ctx,next)=>{
  ctx.body = await rq(BASE_URL + `/song/url?id=${event.musicid}`).then(res=>{
      return res
    })
  })
  app.router('lyric',async(ctx,next)=>{
    ctx.body = await rq(BASE_URL + `/lyric?id=${event.musicid}`).then(res=>{
       return res
     })
   })
  return app.serve()  //返回服务
 
}
