var that;
Page({
  data: {
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'http://bizhi.bcoderss.com/wp-content/uploads/2020/01/Infinix-Smart-4-Wall-DroidViews-01.png'
    }, {
      id: 1,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],
    cur:"init",
    register:false,
    jump:3,
    show:false,
    loadProgress:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    that.api = this.selectComponent("#api");
    that.api.getInfo(that, ['CustomBar','ClientHeight']);

    setTimeout(function () {
      that.setData({
        show:true
      })
    }, 1000);
    setTimeout(function () {
      that.setData({
        register: true
      })
    }, 1200);
    that.timer(3,function(){
      that.setData({
        jump:that.data.jump - 1
      })
      console.log(that.data.jump)
    });
  },
  init(){

  },
  timer(sec,fn){
    that.lr = setInterval(fn,1000)
    that.to = setTimeout(function () {
      clearInterval(that.lr);
    }, 1000 * sec);
  },
  register(){
    that.api.wxGetOpenIdAndUserInfo('boat',function(val){
       if(val=='成功'){
         that.api.getAppInfo(that,['openId','userInfo'],function(val){
           if (val =='success get:userInfo'){
             console.log(that.data.userInfo);
           }
         })
       }else{
         console.log("获取用户信息失败")
       }
     });
    // this.setData({
    //   loadProgress: this.data.loadProgress + 3
    // })
    // if (this.data.loadProgress < 100) {
    //   setTimeout(() => {
    //     this.register();
    //   }, 100)
    // } else {
    //   this.setData({
    //     loadProgress: 0
    //   })
    //   that.api.navTo('/pages/module/lotte/index',null)
    // }
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