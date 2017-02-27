// pages/index/personnelDetail.js
var app = getApp();
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      personnelId: options.personnelId
    });
    this.loadPersonnel();
    this.loadPersonnelProjects();
    this.loadComments(); 
    this.updateCommentNum();
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
  loadPersonnel: function() {
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/personnelDetail', 
        data: {
          id: that.data.personnelId,
          customerId: wx.getStorageSync('id')
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              personnelInfo: res.data.data          
            });
          }
        },
        fail: function(res) {
          console.log("loadPersonnel fail")
        },
        complete: function(res) {
          console.log("loadPersonnel complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  loadPersonnelProjects: function() {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/reserve/personnelProjectList', 
        data: {
          personnelId: that.data.personnelId,
          pageSize: 3
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              projectList: res.data.data          
            });
          }
        },
        fail: function(res) {
          console.log("loadPersonnelProjects fail")
        },
        complete: function(res) {
          console.log("loadPersonnelProjects complete")
          wx.hideNavigationBarLoading();
        }
    });
  },
  updateCommentNum: function(){
    var that = this;
    // console.log(this.data.projectId)
    wx.showNavigationBarLoading();
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectCommentGroupNum', 
        data: {
          personnelId: that.data.personnelId
        },
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            that.setData({
              totalCommentNum: res.data.data.totalReputation,
              goodReputation: res.data.data.goodReputation,
              middleReputation: res.data.data.middleReputation,
              badReputation: res.data.data.badReputation            
            });
          }
        },
        fail: function(res) {
          console.log("updateCommentNum fail")
        },
        complete: function(res) {
          console.log("updateCommentNum complete")
          wx.hideNavigationBarLoading();
        }
    });
  },
  loadComments: function() {
    wx.showNavigationBarLoading();
    // console.log("loadComments: " + this)
    var data = {};
    data["personnelId"] = this.data.personnelId;
    data["commentLevel"] = 3;
    data["pageSize"] = 3;
    // console.log(data)
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/projectCommentList', 
        data: data,
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1) {
            if (res.data.data.length == 0) {
              return false;
            }
            that.setData({
              commentList: res.data.data,
            });
          }
        },
        fail: function(res) {
          console.log("loadComments fail");
        },
        complete: function(res) {
          console.log("loadComments complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  showComments: function() {
    var that = this;
    wx.navigateTo({
      url: '../index/projectComments?personnelId=' + that.data.personnelId,
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
  },
  appoint: function(){
    var that = this;
    wx.redirectTo({
      url: '../quickAppoint/appointProject?from=personnelDetail&personnelId=' + that.data.personnelId,
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
  },
  appointBoth: function(e){
    var that = this;
    var projectId = e.currentTarget.dataset.projectid;
    wx.redirectTo({
      url: '../quickAppoint/appoint?from=personnelDetail&personnelId=' + that.data.personnelId + "&projectId=" + projectId,
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
  }
})