// components/login/login.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        modalShow:Boolean,
    },

    /**
     * 组件的初始数据
     * 
     */
    lifetimes:{
        ready(){
            console.log(this.data.modalShow);
        }
    },
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        //得到用户信息
        onGetUserInfo(event){
            const userInfo = event.detail.userInfo
            //允许授权
            if (userInfo) {
                this.setData({
                    modalShow:false
                })
                this.triggerEvent('loginSuccess',userInfo)
            }
            else {
                this.triggerEvent('loginFail')
            }
        }
    }
})
