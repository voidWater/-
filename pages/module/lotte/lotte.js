Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [],
    lotte: null,
    par: [],
    tabIndex: 1,
    time: 30 * 60 * 60 * 1000,
    show: false,
    cuPar: "",
    showLuck: false,
    luckPar: [],
    master: false,
    currItem: null,
    showPar:false
  },
  onClickShow() {
    this.setData({ show: true });
    var that = this;
    that.setData({
      cuavaurl: that.data.par[0].avaurl
    });
    var i = 0
    var ir = setInterval(function () {
      if (i > that.data.par.length - 1) {
        i = 0;
      }
      that.setData({
        cuavaurl: that.data.par[i].avaurl
      });
      i++;
    }, 100)
    setTimeout(function () {
      clearInterval(ir)
      that.setData({
        showLuck: true
      });
      that.chujiang();
    }, 10000)
  },
  chujiang() {
    var that = this;
    wx.request({
      url: app.globalData.serverUrl + '/lotte/getP?id=' + this.data.lotte.id, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var luckPar = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].lotteitemid != null) {
            var arr = res.data[i].lotteitemid.split(',');
            console.log("当前将：" + that.data.currItem)
            arr.forEach(function (s) {
              if (res.data[i].lotteitemid == that.data.currItem) {
                luckPar.push(res.data[i]);
              }
            });
          }
        }
        that.setData({
          luckPar: luckPar
        });
        var j = 0
        console.log('luckNUm:' + that.data.luckPar.length)
        var il = setInterval(function () {
          if (j > that.data.luckPar.length - 1) {
            clearInterval(il)
          }
          luckPar.push(that.data.par[j])
          that.setData({
            luckPar: luckPar
          });
          j++;
        }, 1000)
      }
    })
  },
  getLuckPar() {
    wx.request({
      url: app.globalData.serverUrl + '/lotte/getP?id=' + options.id, //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          par: res.data
        });
      }
    })
  },
  getLuckPar(e) {
    this.setData({
      currItem:this.data.lotte.list[e.currentTarget.dataset.index]
    })
    console.log(e.currentTarget.dataset.index);
  },
  /**
   * 控制台
   */
  tabSelect: function (e) {
    if (e.currentTarget.dataset.id == 1) {
      this.setData({
        tabIndex: 1
      })
    } else {
      this.setData({
        tabIndex: 2
      })
    }
  },
  downChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  beginlotte(e){//开始抽奖
      var that = this;
      console.log(e.currentTarget.dataset.type)
      this.api.httpGet('lotte/openLotte?openId=' + this.data.openId + '&lotteId=' + this.data.lotte.id + '&lotteItemId=' + e.currentTarget.dataset.id + '&type=' + e.currentTarget.dataset.type + '&status=3', function (res) {
        console.log(res.data)
        if (e.currentTarget.dataset.type == 'open' && res == 1) {
          var lotte = that.data.lotte;
          lotte.status = 2
          that.setData({
            lotte: lotte
          });
        }
      });
  },
  openLotte(e){//抽奖
    this.setData({
      currItem: this.data.lotte.list[e.currentTarget.dataset.index]
    });
    //String openId,String lotteId,String lotteItemId,String type,int status
    var that = this;
    this.api.httpGet('lotte/openLotte?openId=' + this.data.openId + '&lotteId=' + this.data.lotte.id + '&lotteItemId=' + e.currentTarget.dataset.id + '&type=openItem' + '&status=3',function(res){
      console.log(res)
      if(res=='success'){
        that.refresh(that.data.lotte.id, e.currentTarget.dataset.id)
        that.tramLotte();
      }
    });
    //this.tramLotte();
  },
  onClickHide() {
    this.setData({ show: false });
    clearInterval(this.ir);
  },
  tramLotte(){
    this.setData({ show: true });
    var that = this;
    that.setData({
      cuavaurl: that.data.par[0].avaurl
    });
    var i = 0
    this.ir = setInterval(function () {
      if (i > that.data.par.length - 1) {
        i = 0;
      }
      that.setData({
        cuPar: that.data.par[i]
      });
      i++;
    }, 100)
    setTimeout(function () {
      clearInterval(that.ir)
      that.showLuckPar();
    }, 5000)
  },
  showLuckPar(){
    this.setData({
      showPar:true
    })
    var i = 0;
    var that = this;
    this.il = setInterval(function () {
      if (i > that.data.par.length - 1) {
        clearInterval(that.il)
      }
      var luckPar = that.data.luckPar
      luckPar[i].show = true;
      that.setData({
        luckPar: luckPar
      });
      i++;
    }, 1000)
  },
  refresh(val1,val2){
    var that = this;
    this.api.httpGet("lotte/getLuckPar?lotteId=" + val1+"&lotteItemId=" + val2,function(res){
      console.log(res)
      that.setData({
        luckPar: res
      })
    });
  },
  sendSocketMessage() {

      var ob = {code:"2131231312"}
      wx.sendSocketMessage({
        data: JSON.stringify(ob)
      })
  },
  initEventHandle(){
    let that = this
    wx.onSocketMessage((res) => {
      //收到消息
    })
    wx.onSocketOpen(() => {
      console.log('WebSocket连接打开')
    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败')
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
    wx.onSocketMessage(this.handleWebsocketMessage);
  },
  handleWebsocketMessage(res){
    console.log(res)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { 
    //获取该抽奖信息和参与者信息
    this.api = this.selectComponent("#api");
    this.api.getInfo(this, ['userInfo', 'openId', 'UpfileServer']);
    var that = this;
    wx.connectSocket({
      url: 'ws://127.0.0.1:8089/websocket',
      data:{
        code:"123123"
      }, success() {
        console.log('连接成功')
        that.initEventHandle()
      }
    });
   
    this.api.httpGet('lotte/get?id=0ad6b1533dcc4d5c863622c3bc5f972b' ,function(res){
        console.log(res)
        if (res.openid == that.data.openId) {
          that.setData({
            master: true
          });
        }
        that.setData({
          lotte: res
        });
      that.api.httpGet("lotte/getP?id=0ad6b1533dcc4d5c863622c3bc5f972b" ,function(res){
            that.setData({
              par: res
            });
        });
    });
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

