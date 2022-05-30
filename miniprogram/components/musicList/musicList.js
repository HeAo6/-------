// components/musicList/musicList.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        musicList:{
            type:Array
        }
    },
    pageLifetimes:{
        show(){
            this.setData({
                playingId:parseInt(app.getPlayMusicId())
            })
        }
    },   
    /**
     * 组件的初始数据
     */
    data: {
       playingId :-1
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onSelect(event){
            console.log(event.currentTarget.dataset.musicid);
            const musicid = event.currentTarget.dataset.musicid
            const index = event.currentTarget.dataset.index
            this.setData({
                playingId:event.currentTarget.dataset.musicid
            })
            //跳转到播放器页面，把并且传递一些所需要得参数
            wx.navigateTo({
              url: `../../pages/player/player?musicid=${musicid}&index=${index}`,
            })
        }
    }
})
