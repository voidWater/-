Page({
  data: {
    addflag:false,
    addshow:false,
    imgList: [],
    markes:[],
    map:{
      latitude: 113.324520,
      longitude: 23.099994,
    },
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      iconPath: "/images/marker.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 50,
      height: 50
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/images/marker.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  beginmarking(){
    that.setData({
      addflag:true
    })
  },
  marking(val){
    if(that.data.addflag){
      that.setData({
        addshow: true
      })
    }
    console.log(val);
    that.setData({
      latitude: val.detail.latitude,
      longitude: val.detail.longitude,
    })
  },
  hideModal(){
    that.setData({
      addshow: false
    })
  },
  chooseImage(){
    wx.chooseImage({
      count: 3, 
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
    that.setData({
      addflag: false,
      addshow: false
    })
    let marke = {
      name: that.data.name,
      des: that.data.des,
      latitude: that.data.latitude,
      longitude: that.data.latitude,
      imgList: that.data.imgList,
    }
    this.setData({
      markes: this.data.markes.concat(marke)
    })
    this.setData({
      markers: [{
        iconPath: "/images/marker.png",
        id: 0,
        latitude: that.data.latitude,
        longitude: that.data.latitude,
        width: 50,
        height: 50
      }]
    })
    console.log(that.data.markes)
    wx.setStorageSync('markes', that.data.markes)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onReady: function () {
    that = this;
    //var value = wx.getStorageSync('key')
    that.setData({
      markes: wx.getStorageSync('markes')
    })
    var markers = []
    for (let i = 0; i < that.data.markes.length; i++) {
      markers.push({
        iconPath: "/images/marker.png",
        id: i,
        latitude: that.data.markes[i].latitude,
        longitude: that.data.markes[i].longitude,
        width: 50,
        height: 50
      })
    }
    that.setData({
      markers: markers
    })
    console.log(that.data.markers)
    this.api = this.selectComponent("#api");
    this.api.getAppInfo(this, ['ClientHeight', 'CustomBar','location'],function(val){
      console.log(val)
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
