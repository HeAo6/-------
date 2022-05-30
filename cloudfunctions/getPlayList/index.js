// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database({
  env: 'cloud1-6g57yqtg9389de25'
}) //云数据库初始化需要指定环境
const rp = require('request-promise')
const URL = 'http://dadian.store/personalized'

const playlistCollection = db.collection('playlist')

const MAX_LIMIT = 10
// 云函数入口函数
exports.main = async (event, context) => {
  const playlist = await rp(URL).then((res) => {
    const countResult =await playlistCollection.count()
    const total = countResult.total  //得到对象的数量
    const batchTimes = Math.ceil(total / MAX_LIMIT)  //向上取整
    const tasks = []  //用来存放promise
    for (let i = 0; i < batchTimes; i++) {
      //skip是从第几条开始取值 limit是取多少
      let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
      tasks.push(promise)
    } 
    let list = {
      data:[]
    }
    //当task里promise中有值时就开始调用Pomise.all方法并通过reduce方法进行数据的拼接
    if (task.length > 0) {
     list = (await Promise.all(tasks)).reduce((acc,cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
     })
    }
    const playlist = await rp(URL).then((res) => { //得到请求数据
      // return JSON.parse(res).playlists.splice(0, 6) //因为一共有20条 我们只需要6条(收回这句话 还是要数据多一点)
          return JSON.parse(res).playlists
     })
      })
  // let result = playlist.result
  //去重操作
  const newData = []
  for (let i = 0; i < result.length; i++) {
    let flag = true //判断数据是否重复
    for (let j = 0; j < list.data.length; j++) {
      if (result[i].id === list.data[j].id) {
         flag = false
         break
      }
    }
    if (flag) {
      newData.push(result[i])
    }
    
  }

  //插入数据
  for (let i = 0; i < newData.length; i++) {
    await playlistCollection.add({ //获取playlist的集合     //注意异步操作
      data: {
        ...newData[i], //注意三点运算符的使用
        creatTime: db.serverDate() //获取服务器时间
      }
   
    }).then((res) => {
      return "success" + res
      console.log("插入成功");
    }).catch((err) => {
      return "fail" + err
      console.log("插入失败");
    })
  }
  return newData.length

}