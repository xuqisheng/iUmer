// pages/index/location.js
var cities = require("../../utils/cities.js");
var app = getApp();
Page({
  data: {

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: '城市'
    })
    wx.showNavigationBarLoading();
    var that = this;
    console.log("onload");
    this.setData({
      cityList: cities.data,
      currentCity: wx.getStorageSync('cityName') || ""
    });
    this.getSortedCities();

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  getSortedCities: function () {
    var that = this;
    wx.request({
      url: app.globalData.server_url + 'webService/common/getCitySort',
      data: app.encode({

      }),
      method: "POST",
      dataType: "json",
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      success: function (res) {
        if (res.data.code == 1) {
          var cities = res.data.data;
          that.setData({
            hotCities: cities.hot,
            commonCities: cities.common
          })
          that.generateIndex();
          that.locate();
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.desc,
            confirmColor: '#FD8CA3',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {

              }
            }
          });
        }
      },
      fail: function (res) {
        console.log("updateCommentNum fail")
      },
      complete: function (res) {
        console.log("updateCommentNum complete")
      }
    });
  },
  locate: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.setStorageSync('latitude', latitude);
        wx.setStorageSync('longitude', longitude);
        var letterIndex = [];
        // var url = "http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" + latitude + "," + longitude + "&output=json&pois=0&ak=Yh9wolTpm7OZPY57B7spMf4t";
        var url = "https://www.iumer.cn/umer/webService/common/baiduCoordinate";
        wx.request({
          url: url, //仅为示例，并非真实的接口地址
          data: app.encode({
            latitude: latitude,
            longitude: longitude
          }),
          method: "POST",
          dataType: "json",
          header: {
            'Content-Type': 'application/json;charset=UTF-8;'
          },
          success: function (baiduRes) {
            var res = JSON.parse(baiduRes.data.data);
            var find = false;
            var city = res.result.addressComponent.city;
            // console.log(cities.data.length)
            for (var i = 0; i < cities.data.length; i++) {
              // console.log(i)
              var el = cities.data[i];
              // letterIndex.push(el.name);
              // console.log(el)
              var list = el.list;
              for (var j = 0; j < list.length; j++) {
                var ele = list[j];
                var cityName = ele.name;
                var cityCode = ele.code;
                // console.log(ele)
                if (cityName == city) {
                  that.setData({
                    baiduCity: cityName,
                    baiduCityCode: cityCode
                  });
                  console.log("定位到的城市是：" + city);
                  find = true;
                }
              };
            };
            if (!find) {
              that.setData({
                baiduCity: "定位失败"
              });
            }
            // that.setData({
            //   letterIndex: letterIndex
            // });
            // console.log(letterIndex);
          },
          fail: function () {

          },
          complete: function () {
            wx.hideNavigationBarLoading();
          }
        });
        // var speed = res.speed
        // var accuracy = res.accuracy
      }
    });
  },
  generateIndex: function () {
    var that = this;
    var letterIndex = [];
    for (var i = 0; i < that.data.commonCities.length; i++) {
      var el = that.data.commonCities[i];
      letterIndex.push(el.name);
    };
    that.setData({
      letterIndex: letterIndex
    });
  },
  setLocation: function (event) {
    console.log(event)
    var cityCode = event.currentTarget.dataset.code;
    var cityName = event.currentTarget.dataset.name;
    console.log(cityCode + " " + cityName)
    wx.setStorageSync('cityCode', cityCode);
    wx.setStorageSync('cityName', cityName);
    wx.switchTab({
      url: 'index',
      success: function (res) {
        // success
        console.log("success");
      },
      fail: function () {
        // fail
        console.log("failed");
      },
      complete: function () {
        // complete
        console.log("complete");
      }
    })
  },
  moveNav: function (e) {
    var letterIndex = (e.changedTouches["0"].clientY - e.currentTarget.offsetTop) / 378 * this.data.letterIndex.length;
    var letter = this.data.letterIndex[parseInt(letterIndex)];
    this.setData({
      selectedLetter: letter
    });
    console.log(parseInt(letterIndex));
  },
  back: function () {
    wx.switchTab({
      url: 'index',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  searchCity: function (e) {
    wx.navigateToTo({
      url: 'locationSearch',
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
})