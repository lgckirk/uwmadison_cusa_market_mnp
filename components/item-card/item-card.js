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
Component({

  properties: {

      /**
       * Product that this card is supposed to show.
       * @note: This should be a single object, not an array.
       */
      product: {
          type: Object
      }
  },

  data: {
  },

  methods: {
    tapName: function(){
      wx.navigateTo({
        //@note: the project directory is restructured
        url: '../productDetail/productDetail'
      });
    }
  }
})
