let num = 0
Page({
  data: {
    addflag:false,
    addshow:false,
    imgList: [],
    markers: [],
    curNav:'map'
  },
  tabSelect(e){
    this.setData({
      curNav: e.currentTarget.dataset.id
    })
  },
  beginmarking(){
    this.setData({
      addflag:true
    })
  },
  marking(val){
    
    this.setData({
      addshow: true
    })
    console.log(val);
    // this.setData({
    //   latitude: val.detail.latitude,
    //   longitude: val.detail.longitude,
    // })
  },
  hideModal(){
    this.setData({
      addshow: false
    })
  },
  chooseImage(){
    wx.chooseImage({
      count: 1, 
      sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  itemChange(e) {
    if (e.currentTarget.dataset.type == "name") {
      this.setData({
        name: e.detail.value
      });
    } else if (e.currentTarget.dataset.type == "des"){
      this.setData({
        des: e.detail.value
      });
    }
  },
  saveMarke(){
    this.setData({
      addflag: false,
      addshow: false
    })
    let that = this;
    let old = this.data.markers
    this.api.uploadImgToTsy(that.data.imgList[0],function(val){
      let imglist = that.data.imgList;
      imglist[0] = val;
      console.log(imglist[0])
      that.api.getLocation(function (val) {
        that.api.httpPost("boat/createMarker?openId=" + that.data.openId, {
          latitude: val.latitude,
          longitude: val.longitude,
          name: that.data.name,
          des: that.data.des,
          imglist: JSON.stringify(imglist)
        }, function (res) {
          that.api.httpGet("boat/getMarkers?openId=" + that.data.openId, function (res) {
            let list = []
            res.content.list.forEach(function (item, index) {
              item.id = index;
              item.width = 30;
              item.height = 30;
              item.imglist = JSON.parse(item.imglist)
              list.push(item)
            })
            that.setData({
              markers: list
            })
          });
        })
      })
    })
    
    
  },
  // 动态的添加markers
  addMarkers: function () {
    let old = this.data.markers
    this.getLocation(function(val){

    })
    old.push({
      id: 0,
      latitude: 23.099994,
      longitude: 113.337520 + num,
      width: 50,
      height: 50
    })
    // console.log(old)
    this.setData({
      markers: old
    })
  },
  intoMap(e) {
    console.log(e.currentTarget.dataset.index)
    console.log(this.data.markers[e.currentTarget.dataset.index])
    let location = this.data.markers[e.currentTarget.dataset.index]
    let markers = this.data.markers;
    markers[e.currentTarget.dataset.index].iconPath = "/images/marker.png",
    markers[e.currentTarget.dataset.index].width = 50;
    markers[e.currentTarget.dataset.index].height = 50;
    this.setData({
      location: location,
      curNav: 'map',
      markers: markers
    });
  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('markes'))
    if (wx.getStorageSync('markes')==''){
      this.setData({
        markers:[]
      })
    }else{
      this.setData({
        markers: wx.getStorageSync('markes')
      })
    }
  },
  onReady: function () {
    var that = this;
    this.api = this.selectComponent("#api");
    this.api.getAppInfo(this, ['ClientHeight', 'CustomBar','location'],function(val){
      
    });
    that.api.wxGetOpenId('boat', function (val) {
      if (val != '失败') {
        console.log(val)
        that.api.getAppInfo(that, ['openId'], function (val) {
          that.api.httpGet("boat/getMarkers?openId=" + that.data.openId,function(res){
              let list = []
              res.content.list.forEach(function(item,index){
                item.id=index;
                item.iconPath="/images/lo.png"
                item.width=30;
                item.height = 30;
                item.imglist = JSON.parse(item.imglist)
                item.callout= {
                  content: "语言：珊珊是不是傻  预计到达时间：10分钟 ",
                   color: "#ff0000",
                     fontSize: "16",
                      borderRadius: "10",
                         bgColor: "#ffffff",
                           padding: "5",
                             display: "ALWAYS"
                 }
                list.push(item)
              })
              that.setData({
                markers:list
              })
          });
        });
      } else {
        console.log("获取用户信息失败")
      }
    });
    
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})
