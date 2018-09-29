import util from "../../lib/utility";
const app = getApp();

Page({
  data: {
    products: [],
    loadingHidden: false, 
  },
  
  /* load products of currrent user */
  onLoad: function (options) {
    var page = this;

    var userCheck = setInterval(function(){ 
      if (app.globalData.userInfo){
        clearInterval(userCheck);
        // request products
        var request = wx.request({
          url: app.getServerUrl('market'),
          data: {
            Action: "GetProductsByUserId",
            UserId: app.globalData.userInfo
          },
          method: "POST",
          header: {
            "content-type": "application/x-www-form-urlencoded",
          },
          success: function(res){
            page.setData({
              products: res.data.Products
            })
          },
          complete: function() {
            page.setData({ loadingHidden: true });
          }
        });

        // in case of error, loading screen doesn't go on forever
        setTimeout(function() {
          if (!page.data.loadingHidden) {
            page.setData({ loadingHidden: true });
            request.abort();
            wx.showToast({
              title: '网络超时',
              icon: 'loading',
              duration: 2000
            });
          }
        }, 20000);
      }   
    }, 100);
  },

  jumpToProductDetail: function(num) {
    // set session variable and redirect
    app.globalData.products = this.data.products;
    wx.navigateTo({
      url: '/pages/market/productDetail/productDetail?index=' + JSON.stringify(num.target.id)
    })
  },

  endListing: function(num){
    var page = this;
    page.setData({
      loadingHidden: false
    });
    wx.request({
      url: app.getServerUrl('market'),
      data: {
        Action: "EndListing",
        ProductId: page.data.products[num.target.id].ProductId
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function(res){
        // update products array (front-end) and remove the loading box
        var p = page.data.products;
        p.splice(num.target.id, 1);
        page.setData({
          products: p,
          loadingHidden: true
        });
      },
      fail: function() {
        page.setData({
          loadingHidden: true
        });
      } 
    }) 
  },

  /* refresh page: load again */
  onPullDownRefresh: function() {
    var page = this;
    wx.request({
      url: app.getServerUrl('market'),
      data: {
        Action: "GetProductsByUserId",
        UserId: app.globalData.userInfo
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function(res) {
        page.setData({
          products: res.data.Products
        })      
      },

      // success or fail, we need to stop refreshing
      complete: function() {
        wx.stopPullDownRefresh();
      }
    })
  },

  jumpToPostProduct: util.getPageJumpCallback('/pages/market/postProduct/postProduct')
})