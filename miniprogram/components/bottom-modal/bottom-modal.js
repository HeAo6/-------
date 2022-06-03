// components/bottom-modal/bottom-modal.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        modalShow:Boolean
    },
    lifetimes:{
        ready(){
            // console.log('bottom',this.data.modalShow);
        }
    },
    options:{
        styleIsolation:'apply-shared',
        multipleSlots:true,
    },
    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onClose(){
            this.setData({
                modalShow:false
            })
            
        }
    }
})
