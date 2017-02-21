var app = getApp();
Page({
  data:{
    phoneValid: false,
    codeValid: false,
    pwdValid: false
  },
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
  checkPhone: function(e) {
    var phone = e.detail.value;
    var result = phone.match(/^1\d{10}$/);
    this.setData({
       phoneValid: !!result,
       phone: phone
    });
  },
  getCode: function() {
    if (!this.data.phoneValid) {
      return false;
    }
    var that = this;
    wx.request({
      url: 'https://www.iumer.cn/umer/webService/common/authPhone',
      data: {
        "phone": that.data.phone,
        "type": 3, //顾客
        "operationType": 1 //注册
      },
      method: 'POST',
      // header: {}, // 设置请求的 header
      success: function(res){
        // success
        if (res.data.code == 1) {
          wx.showModal({
            title: '提示',
            content: '验证码已发送，请注意查收',
            showCancel: false,
            confirmColor: '#FD8CA3',
            success: function(res) {
              if (res.confirm) {
                
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.desc,
            confirmColor: '#FD8CA3',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                
              }
            }
          })
        }
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },
  checkVerifyCode: function(e) {
    var code = e.detail.value;
    var result = code.match(/^\d{6}$/);
    this.setData({
       codeValid: !!result,
       code: code
    });
  },
  inputPwd: function(e){
    this.setData({
      pwd: e.detail.value,
      pwdValid: e.detail.value && e.detail.value == this.data.pwdVerify 
    })
  },
  inputPwdVerify: function(e){
    this.setData({
      pwdVerify: e.detail.value,
      pwdValid: e.detail.value && e.detail.value == this.data.pwd
    })
  },
  register: function(){
    if (!this.data.phoneValid || !this.data.codeValid || !this.data.pwdValid) {
      return false;
    }
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/sys/user/register', 
        data: {
          phone: that.data.phone,
          password: that.data.pwd,
          openId: wx.getStorageSync('openId'),
        	authCode: that.data.code
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
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
          console.log("searchShopList fail")
        },
        complete: function(res) {
          console.log("searchShopList complete")
        }
    });
  }
})