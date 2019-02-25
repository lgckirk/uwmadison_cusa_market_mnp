
import util from "../../lib/utility";
import Product from "../../models/Product";

const app = getApp();
const noTypeId = 0;
Page({
  data: {
    typeMap: [{id:-1, name:"全部"},{id:7, name:"售卖中"},{id:8, name:"过期"},{id:9, name:"已下架"}],
    loginFinished: false,
    lastId: -1,
    currentType: -1
  },
  onLoad: function () {
    let loadErr = undefined;
    util.showLoading()
    .then(util.getMyContact)
    .then(hasContact=>this.setData({hasContact}))
    .then(()=>this.loadProductWithStatus(-1))
    .catch(function(err){
      console.log("Error loading Product");
      console.log(err);
      loadErr = err;
    })
    .then(util.hideLoading)
    .then(()=>{
      if (loadErr) return util.showToast("加载失败，请稍后重试", "none");
    })
  },
  uploadContact: function(){
    if (this.uploadContact.onUpload) return;
    this.uploadContact.onUpload = true;
    var uploadErr = false, hasUploaded = false;
    util.showLoading()
    .then(util.uploadMyContact)
    .then(imageChosen=>{
      console.log(imageChosen);
      hasUploaded = imageChosen;
      this.setData({"hasContact": this.data.hasContact||imageChosen});
    })
    .catch(err=>uploadErr = err)
    .then(()=>this.uploadContact.onUpload = false)
    .then(util.hideLoading)
    .then(()=>{
      if (uploadErr) util.showToast("服务器连接错误");
      if (hasUploaded) util.showToast("成功上传二维码!");
      setTimeout(()=>this.onPullDownRefresh(), 1000);
    })
  },
  statusChanged: function(e){
    let status = e.currentTarget.dataset.typeid;
    this.setData({"currentType": status});
    this.setData({"lastId": -1});
    this.loadProductWithStatus(status);
  },
  loadProductWithStatus: function(status){
    if (!this.data.hasContact) return new Promise((res, rej)=>res());
    getApp().globalData.contextStatus = status;
    let hasMoreProduct, hasErr = null;
    return util.showLoading()
    .then(()=>util.getMyProduct(this.data.lastId, undefined, status))
    .then(products=>{
      hasMoreProduct = products.length>0;
      let prevLastId = this.data.lastId;
      if (products.length>0)
        this.setData({"lastId": Math.min(...products.map(p=>p.productId))});
      return (prevLastId == -1)?
      this.selectComponent('#index-waterfall').resetProducts(products):
      this.selectComponent('#index-waterfall').addProducts(products);     ;
    })
    .catch(err=>{
      console.log("Fail Load My Product With Status " + status);
      console.log(err);
      hasErr = err;
    })
    .then(util.hideLoading)
    .then(()=>hasErr?util.showToast("加载产品失败", "none"):null);
  },
  // disable pull down
  onPullDownRefresh: function () {
      this.setData({"lastId": -1});
      this.loadProductWithStatus(this.data.currentType)
      .then(wx.stopPullDownRefresh);
  },
  onReachBottom: function() {
     this.loadProductWithStatus(this.data.currentType);
  }
})
