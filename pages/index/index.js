import util from "../../lib/utility";
import Product from "../../models/Product";

const app = getApp();
const noTypeId = 0;

Page({
  data: {
    typeMap: Object.assign({
      recommend: {id: noTypeId, name: "推荐"}
    }, util.getProductTypeMapping()),
    pageOffset: -1,
    currentType: noTypeId,
    searchPattern:"",
    bufferPattern:"",
    bannerImages: ['/images/frontPage/banner.png']
  },

  /**
   * Callback for clicking type icon.
   * This will reload current data with an array of products of
   * the type user clicked on.
   */
  loadProductsWithType: function(e) {
    // Clear out search pattern, back to non-search mode
    this.setData({"searchPattern": ""}); 
    const typeId = e.currentTarget.dataset.typeid;
    // if we are on the same "page", just do a refresh
    if (typeId == this.data.currentType) {
      wx.startPullDownRefresh();
      return;
    }
    // immediately indicate user's selection while waiting
    // for server to respond
    this.setData({
      currentType: typeId,
      pageOffset: -1
    });
    util.showLoading()
    .then(()=>((typeId == noTypeId)?util.getAllActiveProducts():
    util.getProductsByType(typeId)))
    .then(products=>{
      if (!products || products.length == 0) util.showToast("抱歉，没有找到任何商品", "none");
      this.setData({pageOffset: Math.min(...products.map(p=>p.productId))});
      this.selectComponent('#index-waterfall').resetProducts(products);
    })
    .catch(err =>console.log(err))
    .then(util.hideLoading);
  },
  onReady: function() {
    this.loadBanner();
    util.showLoading()
    .then(util.getAllActiveProducts)
    .then(products=>{
      if (!products || products.length == 0) return [];
      this.setData({pageOffset: Math.min(...products.map(p=>p.productId))});
      return this.selectComponent("#index-waterfall").resetProducts(products);
    })
    .catch(err=>{
      console.log(err);
      util.showToast("服务器连接错误", "none");
    })
    .then(util.hideLoading);
  },
  onPullDownRefresh: function () {
    const curType = this.data.currentType;
    const pat = this.data.searchPattern;
    const pageOffset = -1;
    util.showLoading()
    .then(()=>{
      // Search Mode
      if (pat.length>0) return util.searchProducts(pat);
      // no type Mode
      if (curType == noTypeId) return util.getAllActiveProducts(pageOffset);
      // type mode
      else return util.getProductsByType(curType, pageOffset);
    })
    .then(products=>{
      if (!products || products.length == 0) return [];
      // Search Mode, use offset
      if (pat.length>0) this.setData({pageOffset: products.length});
      // Non-search mode, use the min productId
      else this.setData({pageOffset: Math.min(...products.map(p=>p.productId))});
      return this.selectComponent("#index-waterfall").resetProducts(products);
    })
    .catch(err=>{
      console.log("Error: ");
      console.log(err);
      return util.showToast("Error Retrieving Products");
    })
    .then(util.hideLoading)
    .then(wx.stopPullDownRefresh)
  },
  onReachBottom: function () {
    // block on reach bottom when twice
    if (this.data.pageBlocked) return;
    this.setData({"pageBlocked": true});
    // fetch next page of products
    const curType = this.data.currentType;
    const pageOffset = this.data.pageOffset;
    const pat = this.data.searchPattern;
    util.showLoading()
    .then(()=>{
      // Search Mode
      if (pat.length>0) return util.searchProducts(pat, pageOffset);
      // no type Mode
      if (curType == noTypeId) return util.getAllActiveProducts(pageOffset);
      // type mode
      else return util.getProductsByType(curType, pageOffset);
    })
    .then(products=>{
      if (!products || products.length == 0) return [];
      // Search Mode, use offset
      if (pat.length>0) this.setData({pageOffset: products.length});
      // Non-search mode, use the min productId
      else this.setData({pageOffset: Math.min(...products.map(p=>p.productId))});
      return this.selectComponent("#index-waterfall").addProducts(products);
    })
    .catch(err=>{
      console.log("Error: ");
      console.log(err);
      return util.showToast("Error Retrieving Products");
    })
    .then(_=>this.setData({"pageBlocked": false}))
    .then(util.hideLoading)
  },
  inputUpdate: function(e){
    this.setData({"bufferPattern": e.detail.value});
  },
  search:function(){
    // Synchronous buffer and search pattern
    if (this.data.bufferPattern.length == 0) return util.showToast("搜索不能为空", "none");    
    this.setData({"searchPattern": this.data.bufferPattern});
    if (this.data.pageBlocked) return;
    this.setData({"pageBlocked": true});
    // Search and add result to waterfall
    const pat = this.data.searchPattern;
    // console.log("Search Pattern:" + pat);
    return util.showLoading()
    .then(()=>util.searchProducts(pat))
    .then(products=>{
      if (products.length == 0) util.showToast("抱歉，没有找到任何商品", "none");
      // Search Mode, use offset
      this.setData({pageOffset: products.length});
      return this.selectComponent("#index-waterfall").resetProducts(products);
    })
    .catch(err=>{
      console.log("Error: ");
      console.log(err);
      return util.showToast("Error Retrieving Products");
    })
    .then(_=>this.setData({"pageBlocked": false}))
    .then(util.hideLoading)
  },
  loadBanner:function(){
    util.getBanner()
    .then(banners=>{
      if (banners.length == 0) banners.push('/images/frontPage/banner.png')
      this.setData({"bannerImages": banners})
    });
  }
})
