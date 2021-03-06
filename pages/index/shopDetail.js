// pages/index/shopDetail.js
var app = getApp();
Page({
  data:{
    currTab: 0,
    loadMoreTimeStamp: 0,
    refreshTimeStamp: 0,
    appointPersonnelTimeStamp: 0,
    appointProjectTimeStamp: 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      shopId: options.shopId || ''
    });
    this.loadShop();
    this.loadProjects();
    wx.setNavigationBarTitle({
      title: '优美店详情'
    })
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
  showActivies: function(e){
    var that = this;
    wx.redirectTo({
      url: '../activity/activities?shopId=' + that.data.shopId,
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
  loadShop: function(){
    var shopId = this.data.shopId;
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
        url: app.globalData.server_url + 'webService/customer/biz/index/shopDetail', 
        data: app.encode({
          id: shopId
        }),
        method: "POST",
        dataType: "json",
        header: {
           'Content-Type': 'application/json;charset=UTF-8;'
        },
        success: function(res) {
          if (res.data.code == 1){
            var d = res.data.data;
            if (!d.picList || d.picList.length == 0) {
              var filePath = (d.header || "/umer/css/image/wechat/2.jpg"); 
              that.setData({
                projectPics: [{ id: 0, filePath: filePath }]
              });
            } else {
              that.setData({
                projectPics: d.picList
              });
            }
            that.setData({
              shopInfo: d
            });
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
            });
          } 
        },
        fail: function(res) {
          console.log("loadShop fail");
        },
        complete: function(res) {
          console.log("loadShop complete");
          wx.hideNavigationBarLoading();
        }
    });
  },
  switchTab: function (e) {
    if (this.data.currTab == e.target.dataset.tabindex) { 
      return false;  
    } else {  
      this.setData( {  
        currTab: e.target.dataset.tabindex,
      });
    } 
  },
  switchSwiper: function(e) {
    this.setData( {  
      currTab: e.detail.current, 
    });
    if (e.detail.current == 0) {
      this.loadProjects("");
    } else if (e.detail.current == 1) {
      this.loadPersonnels("");
    }
  },
  loadProjects: function(opType) {
    wx.showNavigationBarLoading();
    var that = this;
    var data = {};
    data["shopId"] = that.data.shopId;
    data["pageSize"] = 10;
    data['longitude'] = wx.getStorageSync('longitude');
    data['latitude'] = wx.getStorageSync('latitude');
    if (opType) {
      data["operationType"] = opType;
      switch(opType) {
      case "up": data["timestamp"] = this.data.timestampLast; break;
      case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/shopProjectList', 
      data: app.encode(data),
      method: "POST",
      dataType: "json",
      header: {
          'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          if (res.data.data.length == 0 && !opType) {
            that.setData({
              projectList: [],
              timestampFirst: 0,
              timestampLast: 0
            });
            return false;
          }
          var projectList = opType == "down"? res.data.data.concat(that.data.projectList): opType == "up"? that.data.projectList.concat(res.data.data): res.data.data;
          that.setData({
            projectList: projectList,
            timestampFirst: projectList[0].createDate,
            timestampLast: projectList[projectList.length - 1].createDate
          });
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
          });
        } 
      },
      fail: function(res) {
        console.log("loadProjects fail")
      },
      complete: function(res) {
        wx.hideNavigationBarLoading();
        console.log("loadProjects complete")
      }
    });
  },
  loadPersonnels: function(opType) {
    var that = this;
    wx.showNavigationBarLoading();
    var data = {};
    data["shopId"] = that.data.shopId;
    data["pageSize"] = 10;
    data['longitude'] = wx.getStorageSync('longitude');
    data['latitude'] = wx.getStorageSync('latitude');
    if (opType) {
      data["operationType"] = opType;
      switch(opType) {
      case "up": data["timestamp"] = this.data.timestampLast; break;
      case "down": data["timestamp"] = this.data.timestampFirst; break;
      }
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/shopPersonnelList', 
      data: app.encode(data),
      method: "POST",
      dataType: "json",
      header: {
          'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          if (res.data.data.length == 0 && !opType) {
            that.setData({
              personnelList: [],
              timestampFirst: 0,
              timestampLast: 0
            });
            return false;
          }
          var personnelList = opType == "down"? res.data.data.concat(that.data.personnelList): opType == "up"? that.data.personnelList.concat(res.data.data): res.data.data;
          that.setData({
            personnelList: personnelList,
            timestampFirst: personnelList[0].createDate,
            timestampLast: personnelList[personnelList.length - 1].createDate
          });
          console.log(personnelList)
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
          });
        } 
      },
      fail: function(res) {
        console.log("loadPersonnels fail")
      },
      complete: function(res) {
        wx.hideNavigationBarLoading();
        console.log("loadPersonnels complete")
      }
    });
  },
  loadMore: function(e) {
    console.log("loadMore");
    var timestamp = e.timeStamp;
    if (timestamp - this.data.loadMoreTimeStamp < 500) {

    } else {
      if (this.data.currTab == 0) {
        this.loadProjects("up");
      } else if (this.data.currTab == 1) {
        this.loadPersonnels("up");
      }
    }
    this.setData({
      loadMoreTimeStamp: timestamp
    });
  },
  refresh: function(e){
    console.log("refresh");
    var timestamp = e.timeStamp;
    if (timestamp - this.data.refreshTimeStamp < 500) {

    } else {
      if (this.data.currTab == 0) {
        this.loadProjects("down");
      } else if (this.data.currTab == 1) {
        this.loadPersonnels("down");
      }
    }
    this.setData({
      refreshTimeStamp: timestamp
    })
  },
  appointProject: function(e) {
    var personnelId = e.currentTarget.dataset.personnelid;
    var timestamp = e.timeStamp;
    if (timestamp - this.data.appointProjectTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: '../quickAppoint/appointProject?personnelId=' + personnelId,
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      });
    }
    this.setData({
      appointProjectTimeStamp: timestamp
    })
  },
  appointPersonnel: function(e) {
    var projectId = e.currentTarget.dataset.projectid;
    var activityId = e.currentTarget.dataset.activityid;
    var timestamp = e.timeStamp;
    if (timestamp - this.data.appointPersonnelTimeStamp < 500) {

    } else {
      wx.navigateTo({
        url: '../quickAppoint/appointPersonnel?projectId=' + projectId + '&activityId=' + activityId,
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      });
    }
    this.setData({
      appointPersonnelTimeStamp: timestamp
    })
  },
  callShop: function(e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function(res) {
        // success
      }
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return {
      title: 'iUmer - 优美东方',
      path: '/pages/index/shopDetail?shopId=' + that.data.shopId
    }
  }
}) 