/*
 * Card for displaying ptoructs
 *
 * This is still under development.
 *
 * =====
 * @todo: rename to something more descriptive
 * 
 * @todo: make null-safe
 *
 * @todo: @review all colors and fonts
 *
 * @todo: make more customizable
 *
 */
 import util from "../../lib/utility";
Component({

  properties: {

      /**
       * Product that this card is supposed to show.
       * @note: This should be a single object, not an array.
       */
      product: {
          type: Object
      },
      editable: {
        type: Boolean,
        value: false
      }
  },

  data: { displayed: true},

  methods: {
    viewProduct: function(){
      getApp().globalData.dispayedProduct = this.data.product;
      wx.navigateTo({url: "/pages/productDetail/productDetail?id=" + this.data.product.productId})
    },
    endList: function(){
      if(this.data.product.productStatus != 7) return;
      this.setData({"product.productStatus": 9});
      var networkErr = false;
      util.showLoading()
      .then(_=>util.endList(this.data.product.productId))
      .catch(err=>networkErr = err)
      .then(util.hideLoading)
      .then(()=>{
        if (!networkErr) return util.showToast();
        this.setData({"product.productStatus": 7});
        util.showToast("服务器链接错误");
      })
      .then(()=>this.refreshDisplay());
    },
    refreshDisplay: function(){
      let contextStatus = getApp().globalData.contextStatus;
      this.setData({"displayed": contextStatus == -1 ||
        contextStatus == this.data.product.productStatus});
    },
    republish: function(){
      console.log(getApp().globalData);
      let contextStatus = getApp().globalData.contextStatus;
      console.log("contextStatus: " + contextStatus);
      if(this.data.product.productStatus == 7) return;
      var networkErr = false, 
      prevStatus = this.data.product.productStatus;
      this.setData({"product.productStatus": 7});
      util.showLoading()
      .then(_=>util.republish(this.data.product.productId))
      .catch(err=>networkErr = err)
      .then(util.hideLoading)
      .then(()=>{
        if (!networkErr) return util.showToast();
        this.setData({"product.productStatus": prevStatus});
        util.showToast("服务器链接错误");
      })
      .then(()=>this.refreshDisplay());
    }
  },
})
