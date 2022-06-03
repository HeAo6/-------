import formatTime from '../../utils/format';
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        blog : Object
    },  
    observers:{
        ['blog.createTime'](val){
            if (val) {
               this.setData({
               _createTime: formatTime(new Date(val))
               })
            }
        }
    },
    lifetimes:{
        ready(){
            // console.log(this.data.blog);
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        _createTime:''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //预览方法
        onPreviewImg(e){
            const ds = e.target.dataset
            wx.previewImage({
              urls: ds.imgs,
              current:ds.imgsrc,
            })
        }
    }
})
