var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  inputPwd: function(e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  login: function() {
    var that = this;
    if (!that.data.pwd) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmColor: '#FD8CA3',
        content: '请输入密码',
        success: function(res) {
          if (res.confirm) {
            
          }
        }
      })
      return false;
    }
    wx.request({
        url: app.globalData.server_url + 'webService/customer/sys/user/login', 
        data: {
          phone: wx.getStorageSync('phone'),
          password: that.data.pwd,
          openId: wx.getStorageSync('openId')
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            var data = res.data.data;
            wx.setStorageSync('id', data.id || "");
            wx.setStorageSync("name", data.name || "");
            wx.setStorageSync("phone", data.phone || "");
            wx.setStorageSync("password", data.password || "");
            wx.setStorageSync("header", data.header || "");
            wx.setStorageSync("sex", data.sex == 0? 0: data.sex == 1? 1: "");
            wx.setStorageSync("birthday", data.birthday || "");
            wx.setStorageSync("X-TOKEN", data.token || "");
            wx.setStorageSync("alias", data.alias || "");
            wx.setStorageSync("authCode", data.authCode || "");
            wx.switchTab({
              url: '../index/index',
              success: function(res){
                // success
              },
              fail: function() {
                // fail
              },
              complete: function() {
                // complete
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              confirmColor: '#FD8CA3',
              showCancel: false,
              content: res.data.desc,
              success: function(res) {
                if (res.confirm) {
                  
                }
              }
            })
          }
        },
        fail: function(res) {
          console.log("login fail")
        },
        complete: function(res) {
          console.log("login complete")
        }
    });
  }
})