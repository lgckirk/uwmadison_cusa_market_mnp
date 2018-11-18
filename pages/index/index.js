import util from "../../lib/utility";
import Product from "../../models/Product";

const app = getApp();
const noTypeId = 0;

Page({
  data: {
    typeMap: Object.assign({
      recommend: {id: noTypeId, name: "推荐"}
    }, util.productIdAndName),
    loadingFinish: false, // @todo: use this to implement loading,
    pageOffset: -1,
    currentType: noTypeId
  },

  /**
   * Callback for clicking type icon.
   * This will reload current data with an array of products of
   * the type user clicked on.
   */
  loadProductsWithType: function(e) {
    const typeId = e.currentTarget.dataset.typeid;

    // if we are on the same "page", just do a refresh
    if (typeId == this.data.currentType) {
      wx.startPullDownRefresh();
      return;
    }

    // immediately indicate user's selection while waiting
    // for server to respond
    this.setData({
      loadingFinish: false,
      currentType: typeId,
      pageOffset: -1
    });

    // if user wants to go back to "recommend", load all
    if (typeId == noTypeId) {
      util.getAllActiveProducts()
      .then(data => {
        this.selectComponent('#index-waterfall').resetProducts(data);
        this.setData({ loadingFinish: true });
      }, () => {
        this.setData({ loadingFinish: true });
      });
    }
    // otherwise load products of a specfic type
    else {
      util.getProductsByType(typeId)
      .then(data => {
        this.selectComponent('#index-waterfall').resetProducts(data);
        this.setData({ loadingFinish: true });
      }, () => {
        this.setData({ loadingFinish: true });
      });
    }
  },

  onReady: function() {
    // initialize "recommend" products
    util.getAllActiveProducts().then(data => {
      this.selectComponent('#index-waterfall').addProducts(data);
      this.setData({ loadingFinish: true });
    });
    this.setData({ pageOffset: -1 });
  },

  jumpToMarket: util.getPageJumpCallback('/pages/market/market'),

  jumpToPostProduct: util.getPageJumpCallback('/pages/market/postProduct/postProduct'),
  
  onPullDownRefresh: function () {
    const curType = this.data.currentType;

    // if we are on the recommend "page"
    if (curType == noTypeId) {
      util.getAllActiveProducts().then(data => {
        this.selectComponent('#index-waterfall').resetProducts(data);
        wx.stopPullDownRefresh();
      });
    }
    // else query with a particualr type
    else {
      util.getProductsByType(curType).then(data => {
        this.selectComponent('#index-waterfall').resetProducts(data);
        wx.stopPullDownRefresh();
      });
    }
    // reset current page offset
    this.setData({ pageOffset: -1 });
  },

  onReachBottom: function () {
    // fetch next page of products
    const curType = this.data.currentType;
    const offset = Math.max(this.data.pageOffset, 0);

    // if we are on the recommend "page"
    if (curType == noTypeId) {
      util.getAllActiveProducts(offset).then(data => {
        this.selectComponent('#index-waterfall').addProducts(data);
        this.setData({ pageOffset: offset + data.length });
      });
    }
    else {
      util.getProductsByType(curType, offset).then(data => {
        this.selectComponent('#index-waterfall').addProducts(data);
        this.setData({ pageOffset: offset + data.length });
      });
    }
  }
})
