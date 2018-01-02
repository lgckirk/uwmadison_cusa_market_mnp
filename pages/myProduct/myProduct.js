Page({
  data: {
    products: [],
    loadingHidden: false, 
  },
  
  /* load products of currrent user */
  onLoad: function (options) {
    var app = getApp();
    var page = this;

    var userCheck = setInterval(function(){ 
      if (app.globalData.userInfo){
        wx.request({
          url: 'https://madishare.com/MarketExecute.php',
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
            page.setData({loadingHidden: true});
          } 
        });
        clearInterval(userCheck);
      }   
    }, 100);
  },

  onReady: function () {
  },

  onShow: function () {
  },

  onHide: function () {
  },

  onUnload: function () {
  },

  onReachBottom: function () {
  },

  onShareAppMessage: function () {
  },

  jumpToProductDetail: function(num) {
    var app = getApp();
    // set session variable and redirect
    app.globalData.products = this.data.products;
    wx.navigateTo({
      url: '/pages/2s/productDetail/wp?index=' + JSON.stringify(num.target.id)
    })
  },

  endListing: function(num){
    var page = this;
    page.setData({
      loadingHidden: false
    });
    var app = getApp();
    wx.request({
      url: 'https://madishare.com/MarketExecute.php',
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
      }
    }) 
  },

  /* refresh page: load again */
  onPullDownRefresh: function() {
    var app = getApp();
    var page = this;
    wx.request({
      url: 'https://madishare.com/MarketExecute.php',
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

  jumpToPostProduct: function() {
    wx.navigateTo({
      url: '/pages/2s/postProduct/po'
    });
  }
})