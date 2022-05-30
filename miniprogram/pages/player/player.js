// pages/player/player.js
let musiclist = []
let onPlayingIndex = 0
//获取全局唯一得背景得音频管理器
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        picUrl:'',
        isPlaying : false,
        isLyric:false, //歌词是否显示
        lyric:'',
        isSame:false //表示是否为同一首歌曲
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
    //   从缓存里拿到全部得歌单信息
      musiclist = wx.getStorageSync('musiclist') 
    //   获取索引号
      onPlayingIndex = options.index
      this._loadMusicDetail(options.musicid)
    },
    //    加载音乐详情
    _loadMusicDetail(musicid){
      //判断点击播放的歌曲是不是当前播放的歌曲
      if (musicid == app.getPlayMusicId()) {
        this.setData({
          isSame: true
        })
      }
      else {
        this.setData({
          isSame: false
        })
      }
      if (!this.data.isSame) {
         //在切换歌曲得时候暂停上一首 
         backgroundAudioManager.stop() 
      }
        //获取歌单得详细信息通过枚举得方法
        let music = musiclist[onPlayingIndex]
        //调用api接口显示头部标题
        wx.setNavigationBarTitle({
          title: music.name,
        })
        //设置展示图片和播放状态
        this.setData({
            picUrl:music.al.picUrl,
            isPlaying:false,
        })

        app.setPlayMusicId(musicid)
        wx.showLoading({
          title: '加载中...',
        })

        wx.cloud.callFunction({
          name:'music',
          data:{
            musicid,
            $url:'musicUrl',
          }
        }).then(res=>{
          // console.log(res);
          let result = JSON.parse(res.result)
          // 判断是否为vip歌曲给孕妇提示
          if (result.data[0].url === null) {
            wx.showToast({
              title: '用户无权限播放',
            })
            return 
          }
         if (!this.data.isSame) {
            //自动播放音乐通过设置地址
          backgroundAudioManager.src = result.data[0].url
          //必须要设置音乐的标题否则会报错
          backgroundAudioManager.title = music.name
          backgroundAudioManager.coverImgUrl = music.al.picUrl
          backgroundAudioManager.singer = music.ar[0].name
          backgroundAudioManager.epname = music.al.name
         }
          this.setData({
            isPlaying:true,
          })
          wx.hideLoading()

          //加载歌词
          wx.cloud.callFunction({
            name:'music',
            data:{
              musicid,
              $url:'lyric',
            }
          }).then((res)=>{
             let lyric = '暂无歌词'
             const lrc = JSON.parse(res.result).lrc
             if (lrc) {
               lyric = lrc.lyric
             }
             this.setData({
               lyric
             })
          })
        })
    },
    togglePlaying(){
      //正在播放
      if (this.data.isPlaying) {
        backgroundAudioManager.pause()
      }
      else{
        backgroundAudioManager.play()
      }
      this.setData({
        isPlaying:!this.data.isPlaying
      })
    },
    //上一首切换
    onPrev(){
      onPlayingIndex--
      //如果到第一首，就赋值为歌单得最后一首
      if (onPlayingIndex < 0) {
      onPlayingIndex = musiclist.length - 1
      }
      //调用播放音乐并根据索引传入对应id
      this._loadMusicDetail(musiclist[onPlayingIndex].id)
    },
    //下一首切换
    onNext(){
      onPlayingIndex++

      if (onPlayingIndex === musiclist.length) {
      onPlayingIndex = 0
      }
      this._loadMusicDetail(musiclist[onPlayingIndex].id)
    },
    onChangeLyric(){
      this.setData({
        isLyric: !this.data.isLyric
      })
    },
    timeUpdate(event){
      //选择组件
      this.selectComponent('.lyric').update(event.detail.currentTime)
    },
    onPlay(){
      this.setData({
        isPlaying:true
      })
    },
    onPause(){
      this.setData({
        isPlaying:false
      })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})