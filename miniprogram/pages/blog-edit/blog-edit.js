// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140 //判断输入字数个数
const MAX_IMG_NUM = 9 //最大上传数量
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wordsNum:0,     //单词的数量
        footerBottom:0, //距离底部框的高度
        images:[], //存储图片
        selectPhoto:true,
    },
    onInput(e){
        console.log();
        let wordsNum = e.detail.value.length
        if (wordsNum >= MAX_WORDS_NUM) {
            wordsNum = `最大字数为${MAX_WORDS_NUM}`
        }
        this.setData({
            wordsNum
        })
    },
    onFocus(e){
        console.log(e);
        this.setData({
            footerBottom:e.detail.height
        })
    },
    onBlur(){
        this.setData({
            footerBottom:0
        })
    },
    onChooseImage(){
        // 能再选几张图片
        let max = MAX_IMG_NUM - this.data.images.length
        //选取图片的判断
        wx.chooseImage({
          count: max,
          sizeType:['original','compressed'],
          sourceType:['album','camera'],
          success:(res)=>{
            console.log(res);
            this.setData({
                //追加传入的图片
                images:this.data.images.concat(res.tempFilePaths)
            })
            //还能选几张
            max = MAX_IMG_NUM - this.data.images.length
            this.setData({
                selectPhoto:max<=0 ? false : true 
            })
          }
        })
    },
    onDelete(e){
        //删除图片
        this.data.images.splice(e.target.dataset.index,1)
        this.setData({
            images:this.data.images
        })
        //如果一次上传九张图片且添加按钮隐藏，删除一张图片后添加按钮出现
        if (this.data.images.length === MAX_IMG_NUM - 1) {
            this.setData({
                selectPhoto:true
            })
        }

    },
    //预览图片
    onPreviewImg(e){
        // wxAPI预览图片
        wx.previewImage({
          urls:this.data.images,
          current:e.target.dataset.imgSrc
        })
        console.log(e.target.dataset.imgSrc);
    },
    send(){
        // 数据存储到云数据库
        // 数据库：内容、图片failID、用户openID 头像 昵称 时间
        // 图片-> 云数据库 fileId 云文件
        // 图片上传
        //云存储上传图片只能单个上传，需要通过循环
        for( let i=0;i<this.data.images.length;i++){
            let item = this.data.images[i]
            let suffix = /\.\w+$/.exec(item)[0]
            wx.cloud.uploadFile({
                //云端路径
                cloudPath:'blog/' + Date.now() + '-' + Math.random()*1000000 + suffix,
                //临时路径
                filePath:item,
                success:(res)=>{
                    console.log(res);
                },  
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
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