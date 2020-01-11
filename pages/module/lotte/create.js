import Dialog from '../../../vant/dialog/dialog';
import Toast from '../../../vant/toast/toast';
import Utils from '../../../utils/util';
// pages/module/lotte/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    app:null,
    type: 'new',
    src:"",
    id:"",
    lotteList: [
      {
        fmurl: '/images/5bd2fe5e4e72a_610.jpg',
        avaurl: '/images/5bd2fe5e4e72a_610.jpg',
        name: "一等奖",
        des: '奖品描述',
        num: 1
      }
    ],
    lotte: {
      id: "",
      title: "123123",
      fmurl: "/images/5bd2fe5e4e72a_610.jpg"
    },
    name: "",
    time: '12:01',
    date: '2018-12-25'
  },
  selectImg(e){//选择图片
    var that = this;
    var lotteList = that.data.lotteList;
    this.api.getLocalImage(function(res){
      that.api.uploadImgToTsy(res,function(res){
        lotteList[e.currentTarget.dataset.index].fmurl = res;
        that.setData({
          lotteList: lotteList
        });
      });
            //  wx.uploadFile({
            //    url: that.data.UpfileServer.upfileUrl,
            //    path: that.data.UpfileServer.path,
            //    filePath: res,
            //    name: 'file',
            //    formData:{
            //      bucket: that.data.UpfileServer.bucket,
            //      path:'/lotte/',
            //      secret_key: that.data.UpfileServer.secret_key
            //    },
            //    success: function (res) {
            //      lotteList[e.currentTarget.dataset.index].fmurl = JSON.parse(res.data).data.path;
            //       that.setData({
            //         lotteList: lotteList
            //       });
            //       Toast('加载图片成功');
            //     },
            //     fail(res){
            //       console.log(res)
            //       Toast('图片上传失败，请重新再试！');
            //     }
            //   })
    });
  },
  create() {
    this.setData({ creating: true });
    var lotte = this.data.lotte;
    lotte.openid = this.data.openId;
    lotte.datatime = new Date(this.data.date + " " + this.data.time);
    console.log(Utils.formatTime(lotte.datatime));
    lotte.list = this.data.lotteList;
    if (this.data.name == "") {
      Toast('请输入活动标题');
      this.setData({ creating: false });
      return
    }
    lotte.title = this.data.name;
    console.log(lotte);
    var that = this;
    this.api.httpPost("lotte/create", JSON.stringify(lotte) ,function (res) { 
      if (res == "0") {
        that.setData({ creating: false });
        Toast('网络出问题了，请重试');
      } else {
        that.setData({ creating: false });
        wx.navigateTo({
          url: '/pages/module/lotte/index?type=createSuccess',
        })
      }
    })
  },
  update() {
    this.setData({ creating: true });
    var lotte = this.data.lotte;
    lotte.openid = this.data.openId;
    lotte.datatime = new Date(this.data.date + " " + this.data.time);
    lotte.list = this.data.lotteList;
    if (this.data.name == "") {
      Toast('请输入活动标题');
      this.setData({ creating: false });
      return
    }
    lotte.title = this.data.name;
    console.log(lotte);
    var that = this;
    this.api.httpPost("lotte/update", JSON.stringify(lotte),function(res){
      console.log(res)
      if (res == "0") {
        that.setData({ creating: false });
        Toast('网络出问题了，请重试');
      } else {
        that.setData({ creating: false });
        wx.navigateTo({
          url: '/pages/module/lotte/index?type=createSuccess',
        })
      }
    });
  },
  addlottery() {
    var lotteList = this.data.lotteList;
    lotteList = lotteList.concat({
      fmurl: '/images/5bd2fe5e4e72a_610.jpg',
      avaurl: '/images/5bd2fe5e4e72a_610.jpg',
      name: "一等奖",
      des: '奖品描述',
      num: 1
    });
    this.setData({
      lotteList: lotteList
    });
  },
  minlottery(e) {
    var that = this;
    if (this.data.type == 'new') {
      var lotteList = this.data.lotteList;
      lotteList.splice(e.currentTarget.dataset.index, 1);
      this.setData({
        lotteList: lotteList
      });
    } else {
      this.apt.httpGet("lotte/delItem?id=" + e.currentTarget.dataset.index,function(res){
        if (res == '1') {
          var lotteList = that.data.lotteList;
          lotteList.splice(e.currentTarget.dataset.index, 1);
          that.setData({
            lotteList: lotteList
          });
        } else {
        }
      });
    }
  },
  getLotte(id) {
    var that = this;
    this.api.httpGet('lotte/get?id=' + id, function (res) {
      var lotteList = res.list;
      console.log(lotteList);
      res.list = null;
      console.log(res);
      that.setData({
        lotte: res,
        name: res.title,
        lotteList: lotteList,
        time: Utils.formatTime(new Date(res.datatime)).split(" ")[1],
        date: Utils.formatTime(new Date(res.datatime)).split(" ")[0]
      })
    });
  },
  /**
   * 属性监听
   */
  itemChange(e) {
    var lotteList = this.data.lotteList;
    if (e.currentTarget.dataset.type == "name") {
      lotteList[e.currentTarget.dataset.index].name = e.detail.value
      this.setData({
        lotteList: lotteList
      });
    } else if (e.currentTarget.dataset.type == "des") {
      lotteList[e.currentTarget.dataset.index].des = e.detail.value
      this.setData({
        lotteList: lotteList
      });
    } else if (e.currentTarget.dataset.type == "num") {
      lotteList[e.currentTarget.dataset.index].num = e.detail.value
      this.setData({
        lotteList: lotteList
      });
    }
  },
  timeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  dateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  nameChange(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id == undefined) {
      console.log("new")
      this.setData({
        type: 'new'
      })
    } else {
      this.setData({
        type: 'edit',
        id: options.id
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.api = this.selectComponent("#api");
    this.api.getInfo(this, ['userInfo', 'openId','UpfileServer']);
    this.getLotte(this.data.id)
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