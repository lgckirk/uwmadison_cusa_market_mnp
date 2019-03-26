import util from "../../lib/utility";
import Product from "../../models/Product";
const app = getApp();

Page({
  data: {
    array: util.getProductTypeArray(),
    index: 0
  },
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
  onLoad: function(options){
    // id is required
    if (!options["id"]) {
      console.error("productDetail页面需要一个id作为argument");
      return;
    }

    // product info could already be present
    if (app.globalData["dispayedProduct"]
      && app.globalData["dispayedProduct"]["productId"] == options["id"]) {
        this.setData({
          'imgs': app.globalData["dispayedProduct"]["productImages"],
          'description': app.globalData["dispayedProduct"]["productDescription"],
          'type': app.globalData["dispayedProduct"]["productType"]
        });
      }

    // otherwise we need to load it
    else {
      wx.showLoading({
        title: '正在加载...',
      });
      const timer = setTimeout(() => {
        // a fail safe mechnism - we dont want to show it forever...
        wx.hideLoading();
      }, 5000);

      util.getProductById(options["id"])
      .then((product) => {
        // stop the loading model
        clearTimeout(timer);
        wx.hideLoading();

        // we got the product, now display
        if (product) {
          this.setData({
            'imgs': product["productImages"],
            'description': product["productDescription"],
            'type': product["productType"]
          });
        }

        // otherwise notify user
        // TODO: use a custom image, right now the icon is a checkmark
        else {
          wx.showToast({
            title: '好像出了点问题',
            duration: 2000
          });
        }
      });
    }
  },
  onShareAppMessage(config) {
    const ret = {
      'title': app.globalData["dispayedProduct"].productName
          + ': ' + app.globalData["dispayedProduct"].productDescription
    };
    const images = app.globalData["dispayedProduct"].productImages;
    ret['imageUrl'] = images.length > 0 ?
        images[0] : '/images/noPicture.png';

    return ret;
  },
  imgErr: function(event){
      let buffer = {};
      buffer[event.currentTarget.id] = "/images/noPicture.png";
      this.setData(buffer);
  },
  previewContact: function(){
    util.getContactById(app.globalData.dispayedProduct.productOwner)
    .then(contactURL=>{
      console.log("ContactURL: " + contactURL);
      return contactURL;
    })
    .then(contactURL=>{wx.previewImage({urls: [contactURL],success:(feedback=>{
      console.log("Successfully Preview");
      console.log(feedback);
    })})});
  },
  previewImages: function(){
    wx.previewImage({urls: this.data.imgs});
  },
  goHome: function() {
    wx.switchTab({
      url: '/pages/index/index',
    });
  }
})