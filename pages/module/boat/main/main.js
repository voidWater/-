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
    this.setData({
      addflag: false,
      addshow: false
    })
    let that = this;
    let old = this.data.markers
    this.api.getLocation(function (val) {
      old.push({
        id: 0,
        latitude: val.latitude,
        longitude: val.longitude,
        width: 50,
        height: 50,
        name:that.data.name,
        des:that.data.des,
        imgList:that.data.imgList
      })
      that.setData({
        markers: old
      });
      wx.setStorageSync('markes', that.data.markers)
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
  intoMap(e){
    console.log(e.currentTarget.dataset.index)
    console.log(this.data.markers[e.currentTarget.dataset.index])
    let location = this.data.markers[e.currentTarget.dataset.index]
    let markers = this.data.markers;
    markers[e.currentTarget.dataset.index].iconPath= "/images/marker.png",
    this.setData({
      location: location,
      curNav:'map',
      markers: markers
    });
  },
  onReady: function () {
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
