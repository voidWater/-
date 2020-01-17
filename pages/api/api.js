import Toast from '../../vant/toast/toast';
const app = getApp();
// pages/Api/Api.js
/**
 * 跳转页面:              navTo(url,data)
 * get http访问:          httpGet(url, fn)
 * post http访问:         httpPost(url, data, fn)
 * 获取当前定位:           getLocation(fn)
 * 获取用户信息:           getUserInfo(fn)
 * 获取用户小程序openId:   getOpenId(fn) 
 * 获取基本信息:           getInfo(instan, param, fn)[location,userInfo,openId,ColorList,UpfileServer]
 * 获取本地或拍摄图片       getLocalImage(fn) param [res:图片地址]
 * 获取本地或拍摄图片       getLocalImage(fn) param [res:图片地址]
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {

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
    loading(msg){
      if(msg){
        Toast.loading({
          duration: 0,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          message: msg,
          loadingType: 'spinner',
          selector: '#van-toast'
        });
      }
      else{
        Toast.clear();
      }
      
    },
    toast(msg){
      Toast(msg);
    },
    navTo(url, data) {//跳转页面
      wx.navigateTo({
        url: url,
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          acceptDataFromOpenedPage: function (data) {
          },
          someEvent: function (data) {
          }
        },
        success: function (res) {
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage', data)
        }
      })
    },
    httpGet(url, fn) {//get http访问
      wx.request({
        url: app.globalData.serverUrl + url, //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          //console.log("get:" + res.data)
          fn(res.data);
        },
        fail(res) {
          console.log(res);
        }
      })
    },
    httpPost(url, data, fn) {//post http访问
      wx.request({
        url: app.globalData.serverUrl + url, //仅为示例，并非真实的接口地址
        method: "POST",
        data: data,
        header: {
          "Content-Type": "application/json;charset=utf-8" // 默认值
        },
        success(res) {
          fn(res.data)
        },
        fail(res) {
          console.log(res);
        }
      })
    },
    getLocation(fn) {//获取当前定位
      wx.getLocation({
        type: 'wgs84',
        success: (res) => {
          fn(res);
        }
      })
    },
    wxlogin(fn){//获取userInfo和openId
      var that = this;
      that.getUserInfo(function(res){
        wx.login({
          success(res) {
            if (res.code) {
              //发起网络请求
              that.httpGet("lotte/getOpenId?code=" + res.code, function (res) {
                app.globalData.openId = res.openid;
                app.globalData.session_key = res.session_key;
                fn("成功");
              });
            } else {
              console.log('登录失败！' + res.errMsg)
                fn("失败");
            }
          }
        })
      });
    },
    getUserInfo(fn) {//获取用户信息
      if (app.globalData.userInfo == null) {
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            fn(app.globalData.userInfo)
          },
          fail: res => {
            console.log(res);
          }
        });
      } else {
        fn(app.globalData.userInfo)
      }
    },
    getOpenId(code,fn) {//获取用户小程序openId
      if (app.globalData.openId == null) {
        //TODO
        //app.globalData.openId = "sdfsdf23421fa143"
        this.httpGet("getOpenId?code=" + code,function(res){
          console.log("getOpenId:"+res);
        })
        if(fn){
          fn(app.globalData.openId)
        }
      } else {
        if (fn) {
          fn(app.globalData.openId)
        }
      }
    },
    getInfo(instan, param, fn) {//获取基本信息
      for (let i = 0; i < param.length; i++) {
        if (param[i] == "location") {
          this.getLocation(function (res) {
            instan.setData({
              location: res
            });
          });
        } else if (param[i] == "userInfo") {
          this.getUserInfo(function (res) {
            instan.setData({
              userInfo: res
            });
          });
        } else if (param[i] == "openId") {
          this.getOpenId({},function (res) {
            instan.setData({
              openId: res
            });
          });
         
        } else if (param[i] == "ColorList") {
          instan.setData({
            ColorList: app.globalData.commonData.ColorList
          });
        } else if (param[i] == 'UpfileServer'){
          instan.setData({
            UpfileServer: app.globalData.UpfileServer
          });
        }
      }
      if (fn) {
        fn();
      }
    },
    getLocalImage: function (fn) {
      wx.chooseImage({
        count: 1,
        success: function (res) {
          // 这里无论用户是从相册选择还是直接用相机拍摄，拍摄完成后的图片临时路径都会传递进来
          fn(res.tempFilePaths[0])
        },
        fail: function (error) {

        },
        complete: function () {

        }
      })
    },
    uploadImgToTsy:function(imgUrl,fn,fail){
      wx.uploadFile({
        url: app.globalData.UpfileServer.upfileUrl,
        filePath: imgUrl,
        name: 'file',
        formData: {
          bucket: app.globalData.UpfileServer.bucket,
          path: '/lotte/',
          secret_key: app.globalData.UpfileServer.secret_key
        },
        success: function (res) {
          fn(JSON.parse(res.data).data.path);
        },
        fail(res) {
          if (fail){
            fail();
          }
        }
      })
    }
  }
})
