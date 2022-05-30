// components/progress-bar/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let currentSec = -1 //当前秒数
let duration = 0 //歌曲总时长
let isMoving = false //当前进度条是否在拖拽

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isSame:Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {
        showTime:{
            currentTime:'00:00',
            totalTime:'00:00' 
        },
        movableDis:0,
        progress:0
    },

    lifetimes:{
        ready(){
            if (this.properties.isSame && this.data.showTime.totalTime == '00:00') {
                this._setTime()
            }
            this._getMovableDis()
            this._bindBGMEvent()
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onChange(event){
            //判断是否是拖动
            if (event.detail.source == 'touch') {
                this.data.progress = event.detail.x / (movableAreaWidth - movableViewWidth ) * 100
                this.data.movableDis = event.detail.x
                isMoving = true
            }
        },
        onTouchEnd(){
            const currentTimeFmt =this._dataFormat(Math.floor(backgroundAudioManager.currentTime))
            this.setData({
                progress:this.data.progress,
                movableDis: this.data.movableDis,
                ['showTime.currentTime']:`${currentTimeFmt.min}:${currentTimeFmt.sec}`
            })
            backgroundAudioManager.seek(duration * this.data.progress / 100)
            isMoving = false
        },
        //获取进度条得宽度
        _getMovableDis(){
            const query = this.createSelectorQuery()
            //类似于获取dom元素，因为在不同的机型进度条的宽度不一致
            query.select('.movable-area').boundingClientRect()
            query.select('.movable-view').boundingClientRect()
            query.exec((rect)=>{
                movableAreaWidth = rect[0].width
                movableViewWidth = rect[1].width
            })
        },
        _bindBGMEvent(){
            backgroundAudioManager.onPlay(()=>{
                console.log('onPlay');
                isMoving = false
                this.triggerEvent('musicPlay')
            })
            backgroundAudioManager.onStop(()=>{
                console.log('onStop');
            })
            backgroundAudioManager.onPause(()=>{
                console.log('onPause');
                this.triggerEvent('musicPause')
            })
            backgroundAudioManager.onWaiting(()=>{
                console.log('onWaiting');
            })
            //歌曲是否能播放
            backgroundAudioManager.onCanplay(()=>{
                console.log('onCanplay')
                //判断歌曲的播放歌曲的总时间
                if (backgroundAudioManager.duration !== undefined) {
                    this._setTime()
                }
                //经过实验获取总时间可能获取不到 ，需要延时一秒来保证获取事件，再到用函数
                else{
                    setTimeout(()=>{
                        this._setTime()
                    },1000)
                }
            })
            backgroundAudioManager.onTimeUpdate(()=>{
                console.log('onTimeUpdate');
                if (!isMoving) {
                //获取当前的时长
               const currentTime = backgroundAudioManager.currentTime
               const duration = backgroundAudioManager.duration
                if (currentTime.toString().split('.')[0] !=currentSec) {
                    // console.log(currentTime);
                const currentTimeFmt = this._dataFormat(currentTime)
               this.setData({
                movableDis:(movableAreaWidth - movableViewWidth ) * currentTime / duration,
                progress: currentTime / duration * 100,
                ['showTime.currentTime']: `${currentTimeFmt.min}:${currentTimeFmt.sec}`,
               })
               currentSec = currentTime.toString().split('.')[0]
               this.triggerEvent('timeUpdate',{
                currentTime
               })
                }
                    }
            })
            backgroundAudioManager.onEnded(()=>{
                console.log('onEnded');
                //子传父
                this.triggerEvent('musicEnd')
            })
            backgroundAudioManager.onError((res)=>{
                console.error(res.errMsg);
                console.error(res.errMsg);
                wx.showToast({
                  title: '错误' + res.errMsg,
                })
            })
        },
        //将获取的时间的格式调整
        _setTime(){
            //获取歌曲总时间
           duration = backgroundAudioManager.duration
          const durationFmt = this._dataFormat(duration)
            this.setData({
                //只设置对象中的单一属性的值通过中括号的方式并配合模板字符串
                ['showTime.totalTime']:`${durationFmt.min}:${durationFmt.sec}`
            })
        },
        //格式化时间
        _dataFormat(sec){
            //取到分钟（整数）
            const min = Math.floor(sec/60)
            //取到秒数（整数）
            sec = Math.floor(sec % 60)
            return {
                'min':this._parseZero(min),
                'sec':this._parseZero(sec)
            }
        },
        //进行补零的操作（三元运算符）
        _parseZero(sec){
            return sec < 10 ? '0' + sec : sec
        },
        
    }
})
