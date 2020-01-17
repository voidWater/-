import Dialog from '../../../vant/dialog/dialog';
import Toast from '../../../vant/toast/toast';
const app = getApp()
// pages/module/lotte/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    openId:null,
    PageCur: 'comm1',
    activeNames: [],
    lotte_list_1: [],
    lotte_list_2: [],
    serverUrl: "",
    show: false,
    code: "",
    login: false,
    curList:2
  },
  /**
   * 首页登录管理
   */
  login: function () {
    if (this.data.userInfo == null) {
        Toast("请先登录");
        this.setData({ PageCur: 'comm2' });
        return false
    }
    return true;
  },
  login2:function(){
      var that = this;
      this.api.wxlogin(function (res) {
        console.log(res)
        that.api.getInfo(that, ['userInfo', 'openId']);
      });
  },
  fn_getUserInfo() {
    console.log(12)
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        console.log(app.globalData.userInfo);
      }
    })
  },
  fn_getUserOpenId: function () {
    var that = this;
    wx.login({
      success(res) {
        console.log(res.code);
        that.setData({
          openId: res.code
        });
      }
    })
  },
  toggle: function (e) {
    console.log(e.currentTarget.dataset.cur)
    this.setData({ PageCur: e.currentTarget.dataset.cur });
    var that = this;
    if (e.currentTarget.dataset.cur == 'comm2') {
      this.list();
    }
  },
  /**
   * 我的抽奖
   */
  list() {//获取首页抽奖列表
    var that = this;
    this.api.httpGet('lotte/list?openId='+this.data.openId,function(res){
      //console.log(res);
      that.setData({
        lotte_list_1:res
      })
    });
    this.api.httpGet('lotte/listJoin?openId=' + this.data.openId, function (res) {
      //console.log(res);
      that.setData({
        lotte_list_2: res
      })
    });
  },
  showbar(e){
    var that = this;
    var list = that.data.lotte_list_1;
    console.log(list[e.currentTarget.dataset.index]);
    list[e.currentTarget.dataset.index].showbar = !list[e.currentTarget.dataset.index].showbar;
    that.setData({
      lotte_list_1:list
    });
  },
  toggleList:function(e){
    this.setData({
      curList:e.currentTarget.dataset.index
    })
  },
  createLotte: function () {
    if (!this.login()) {
      return
    }
    wx.navigateTo({
      url: '/pages/module/lotte/create?type=1'
    })
  },
  editLotte: function (e) {
    wx.navigateTo({
      url: 'create?id=' + e.currentTarget.dataset.id
    })
  },
  delLotte: function (e) {
    console.log(e.currentTarget.dataset.id)
    var that = this;
    this.api.httpGet('lotte/del?id=' + e.currentTarget.dataset.id,function(){
      that.list();
    });
  },
  toLotte: function (e) {
    wx.navigateTo({
      url: 'lotte?id=' + e.currentTarget.dataset.id
    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  /**
   * 参与抽奖
   */
  share(e) {
    this.api.httpGet('lotte/getCode?lotteId=' + e.currentTarget.dataset.id, function (res) {
      console.log(res.data);
      Dialog.alert({
        title: '抽奖参与码',
        message: res
      }).then(() => {
        // on close
      });
    });
  },
  join() {
    if (!this.login()) {
      return
    }
    this.setData({
      show: true
    })
  },
  codeChange(e) {
    this.setData({
      code: e.detail.value
    })
  },
  joinLotte() {
    var that = this;
    var url = 'lotte/join?openId=' + this.data.openId + ' &nickName=' + this.data.userInfo.nickName + "&avaUrl=" + this.data.userInfo.avatarUrl + "&code=" + this.data.code;
    this.api.httpGet(url, function (res) {
       console.log(res)
        if (res == []) {
          console.log(res.data);
          Toast("该邀请码无效");
          return
        }
        wx.navigateTo({
          url: 'lotte?id=' + res
        })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type){
      if (options.type == 'createSuccess') {//创建成功返回首页我的创建抽奖列表
        this.setData({
          PageCur: 'comm2',
          activeNames: ['1'],
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.api = this.selectComponent("#api");
    var that= this;
    if(this.data.openId==null){
      console.log(1)
      this.api.wxlogin(function (res) {
        console.log(res)
        if (res == '成功') {
          that.api.getInfo(that, ['userInfo', 'openId'],function(){
            console.log(app.globalData.openId)
            console.log(that.data.userInfo)
            that.list();
          });
        } else {
        }
      });
    }else{
      this.list();
    }

    
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