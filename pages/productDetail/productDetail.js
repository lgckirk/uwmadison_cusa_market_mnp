import util from "../../lib/utility";
import Product from "../../models/Product";
const app = getApp();

Page({
  data: {
    array: util.getProductTypeArray(),
    index: 0
  },
  onLoad: function(options){
    this.setData({
      'imgs': app.globalData.dispayedProduct.productImages,
      'description': app.globalData.dispayedProduct.productDescription,
      'type': app.globalData.dispayedProduct.productType
    });
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
  }
})