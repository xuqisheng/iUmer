// pages/index/projectSearch.js
var app = getApp();
Page({
  data:{
    showArea: true,
    showNear: true,
    showSorting: true,
    showCategory: true,
    page: 1
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      'type': options.type
    });
    this.loadAreaList();
    this.loadCategoryList();
    this.loadProjects();
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
  showAreaF: function() {
    this.setData({
      showArea: false,
      showSorting: true,
      showCategory: true
    });
  },
  showSortingF: function() {
    this.setData({
      showArea: true,
      showSorting: false,
      showCategory: true
    });
  },
  showCategoryF: function() {
    this.setData({
      showArea: true,
      showSorting: true,
      showCategory: false
    })
  },
  loadAreaList: function() {
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/common/areaList', 
      data: {
        cityId: wx.getStorageSync('cityCode')
      },
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            areaList: res.data.data
          });
        }
      },
        fail: function(res) {
          console.log("getPPT fail")
        },
        complete: function(res) {
          console.log("complete")
        }
    });
  },
  showNearF: function() {
    this.setData({
      showNear: false
    });
  },
  hideFilter: function() {
    this.setData({
      showArea: true,
      showSorting: true,
      showCategory: true
    })
    console.log(this.data.showArea)
  },
  clickArea: function(e) {
    var areaId = e.currentTarget.dataset.areaid;
    var range = e.currentTarget.dataset.range;
    this.setData({
      showArea: true,
      areaId: areaId,
      range: range,
      page: 1
    });
    this.loadProjects();
  },
  clickSorting: function(e) {
    var sortingId = e.currentTarget.dataset.sortingid;
    this.setData({
      showSorting: true,
      sortingId: sortingId,
      page: 1
    });
    this.loadProjects();
  },
  loadCategoryList: function() {
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/common/projectTypeTree', 
      data: {
        
      },
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          that.setData({
            categoryList: res.data.data
          });
        }
      },
        fail: function(res) {
          console.log("loadCategoryList fail")
        },
        complete: function(res) {
          console.log("loadCategoryList complete")
        }
    });
  },
  clickCategory: function(e) {
    var categoryNo = e.currentTarget.dataset.categoryno;
    this.setData({
      showCategory: true,
      categoryNo: categoryNo,
      page: 1
    });
    this.loadProjects();
  },
  loadProjects: function() {
    var that = this;
    var data = {};
    if (that.data.areaId) {
      data["areaId"] = that.data.areaId;
    }
    if (that.data.range) {
      data["range"] = that.data.range;
      data["longitude"] = wx.getStorageSync("longitude");
      data["latitude"] = wx.getStorageSync("latitude");
    }
    if (that.data.categoryNo) {
      data["groupNo"] = that.data.categoryNo;
    }
    data["page"] = that.data.page;
    data["pageSize"] = 10;
    data["cityId"] = wx.getStorageSync("cityCode");
    if (that.data.sortingId) {
      data["orderType"] = that.data.sortingId;
      if (that.data.sortingId == 2) {
        data["sort"] = "asc";
      } else {
        data["sort"] = "desc";
      }
    }
    wx.request({
      url: app.globalData.server_url + 'webService/customer/biz/index/searchProjectList', 
      data: data,
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function(res) {
        if (res.data.code == 1) {
          if (res.data.data.length == 0 && that.data.page == 1) {
            that.setData({
              projectList: []
            });
            return false;
          } else if (res.data.data.length == 0) {
            that.setData({
              page: that.data.page - 1
            });
            return false;
          }
          var projectList = that.data.page == 1? res.data.data: that.data.projectList.concat(res.data.data);
          that.setData({
            projectList: projectList
          });
        }
      },
      fail: function(res) {
        console.log("loadProjects fail")
      },
      complete: function(res) {
        console.log("loadProjects complete")
      }
    });
  },
  loadMore: function() {
    this.data.page++;
    this.loadProjects();
  },
  refresh: function() {
    this.data.page = 1;
    this.loadProjects();
  }
})