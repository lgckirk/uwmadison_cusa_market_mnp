Page({
  data: {
    typeID: null,
    products: [],
  },

  onLoad: function(options) {
    // set typeId of this product
    this.setData({      
      typeID: parseInt(JSON.parse(options.typeID))
    });

    // attempt to load products of this type
    var page = this;
    wx.request({
      url: 'https://madishare.com/MarketExecute.php',
      data: {
        Action: "GetProductsByType",
        TypeId: this.data.typeID
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
      
      // TODO: need to handle the case in which there is no internet
      // set product icon image for all products
      complete:function(){
        for (var i = 0; i < page.data.products.length; i++) {
          var p = page.data.products;
          if (p[i].ProductImages.length != 0) {
            p[i].icon = p[i].ProductImages[0];
          }
          else {
            p[i].icon = "/images/usedItemMarket/buy/noPicture.png";
          }
          page.setData({products: p});
        }
      }
     })
  },

  onReady: function () {
  },

  onShow: function () {
  },

  onHide: function () {
  },

  onUnload: function () {
  },

  /* refresh page */
  onPullDownRefresh: function (options) {
    // attempt to load products of this type
    var page = this;
    wx.request({
      url: 'https://madishare.com/MarketExecute.php',
      data: {
        Action: "GetProductsByType",
        TypeId: this.data.typeID
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        page.setData({
          products: res.data.Products
        })
      },

      // set product icon image for all products
      complete: function () {
        for (var i = 0; i < page.data.products.length; i++) {
          var p = page.data.products;
          if (p[i].ProductImages.length != 0) {
            p[i].icon = p[i].ProductImages[0];
          }
          else {
            p[i].icon = "/images/usedItemMarket/buy/noPicture.png";
          }
          page.setData({ products: p });
        }
      }
    })
    wx.stopPullDownRefresh()
  },

  onReachBottom: function () {
  },

  onShareAppMessage: function () {
  },
 
  /* click event for each block of product */
  jumpTowp: function(num) {
    var app = getApp();
    app.globalData.products = this.data.products;

    wx.navigateTo({
      url: '/pages/2s/productDetail/wp?index='+JSON.stringify(num.target.id)
    })
  }

})