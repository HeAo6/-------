// components/lyric/lyric.js
let lyricHeight = 0
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isLyric:{
            type:Boolean,
            value:false
        },
        lyric:String,
    },
     observers:{
        lyric(lrc){
            if (lrc === '暂无歌词') {
                this.setData({
                    lrcList:[
                        {
                            lrc,
                            time:0
                        }
                    ],
                    nowLrcIndex:-1,
                    
                })
            }
            else{
                this._parseLyric(lrc)
            }
        }
     },
    lifetimes:{
        ready(){
            //换算
            wx.getSystemInfo({
              success: (result) => {
                  //求出1rpx的大小
                  lyricHeight = result.screenWidth / 750 * 64
              },
              
            })
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        lrcList:[],
        nowLrcIndex:0, //选中的歌词索引
        scrollTop:0 //歌词的滚动
    },

    /**
     * 组件的方法列表
     */
    methods: {
        update(currentTime){
            let lrcList = this.data.lrcList
            if (lrcList.length === 0) return 
            if (currentTime > lrcList[lrcList.length - 1].time) {
                if (this.data.nowLrcIndex != -1) {
                    this.setData({
                        nowLrcIndex : -1,
                        scrollTop: lrcList.length * lyricHeight
                    })
                }
            }
            for(let i = 0 ; i<lrcList.length;i++){
                if (currentTime <= lrcList[i].time) {
                    this.setData({
                        nowLrcIndex:i - 1,
                        scrollTop: (i - 1) * lyricHeight,
                    })
                    break;
                }
            }
        },
        _parseLyric(sLyric){
            let line = sLyric.split('\n')

            let _lrcList = []
            line.forEach((item)=>{
                let time = item.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
                if (time != null) {
                   let lrc = item.split(time)[1]
                   let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
                   //把时间转换为秒
                   let time2Seconds = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
                   _lrcList.push({
                       lrc,
                       time:time2Seconds,
                   }) 

                }
            })
            this.setData({
                lrcList:_lrcList
            })
        }
    }
})
