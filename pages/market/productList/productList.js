const app = getApp();

Page({
  data: {
    ready: false,
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
      url: app.getServerUrl('market'),
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
      complete:function(){
        // set product icon image for all products
        for (var i = 0; i < page.data.products.length; i++) {
          var p = page.data.products;
          if (p[i].ProductImages.length != 0) {
            p[i].icon = p[i].ProductImages[0];
          }
          else {
            p[i].icon = "/images/usedItemMarket/buy/no_preview.png";
          }
          page.setData({products: p});
        }

        // render page
        page.setData({
          ready: true
        });
      }
    })
  },

  /* refresh page */
  onPullDownRefresh: function (options) {
    // attempt to load products of this type
    var page = this;
    wx.request({
      url: app.getServerUrl('market'),
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
            p[i].icon = "/images/usedItemMarket/buy/no_preview.png";
          }
          page.setData({ products: p });
        }
      }
    })
    wx.stopPullDownRefresh()
  },

  /**
   * Jumpt to the product detail page of the product being clicked on.
   * @param object event The tap event object
   */
  jumpToProductDetail: function(event) {
    app.globalData.products = this.data.products;

    wx.navigateTo({
      url: '/pages/market/productDetail/productDetail?index='+JSON.stringify(event.target.id)
    })
  }
})