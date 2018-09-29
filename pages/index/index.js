import util from "../../lib/utility";
const app = getApp();

Page({
  data: {
    loginFinished: false
  },

  onLoad: function () {
    var page = this;

    // get userID
    wx.login({
      success: function (res) {
        if (res.code) {
          // get our own user id
          wx.request({
            url: app.getServerUrl('login'),
            data: {
              LoginCode: res.code
            },
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded",
            },
            success: function (res) {
              app.globalData.userInfo = parseInt(res.data.UserId);
            },
            complete: function() {
              page.setData({
                loginFinished: true
              });
            }
          })
        } else {
          console.warn('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  onShow: function() {
    if (this.data.loginFinished && !app.globalData.userInfo) {
      this.onLoad();
    }
  },

  jumpToMarket: util.getPageJumpCallback('/pages/market/market'),

  jumpToPostProduct: util.getPageJumpCallback('/pages/market/postProduct/postProduct'),
  
  // disable pull down
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})