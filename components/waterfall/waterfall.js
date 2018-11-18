/**
 * Component for a waterfall of cards.
 *
 * This implementation uses individual <view>s for each column,
 * rather than a pure CSS solution (which somehow has a very weird rendering),
 * and is thus separated into another component.
 *
 * The positioning of the column is handling by CSS flex box. 
 * | This *could* lead to another layer of complexity in the future, 
 * | by that time I suppose we can switch to float: left or something else. -ryan
 *
 * This is still under development.
 *
 * =====
 *
 * @property: columnCount {Number} The number of columns to be shown.
 *            Do not change this after initialization, it will not do anything.
 *            Default to 2.
 *
 * =====
 * @note: Because of the limitation of components, making this view a
 * seperate component means that we resign any possibility to customize the
 * internals of this waterfall other than number of columns. This can be
 * a potential problem when, for example, we want to swap out the type of cards.
 *
 * And I just though about a solution to this as I was writing this, by wrapping
 * the <slot> with a <view>, but it's weird.
 * <view class="something" wx:for="" ...>
 *     <slot></slot>
 * </view>
 * -ryan
 *
 * @note: see addProducts()
 *
 * =====
 * @todo: Add method for data cleanup.
 *
 * @todo: make more customizable
 * 
 */
Component({
  properties: {
    "columnCount": {
      type: Number,
      value: 2
    },
  },

  data: {
    _columns: []
  },

  methods: {
    addProducts: function (products) {
      // if no products available, just bail out (don't refresh the page)
      if (!products || products.length == 0) {
        return;
      }

      //@todo: check null
      var tempColumns = this.data._columns,
        current,
        cursor = 0;

      // put products in columns in a round-robin fashion
      // @todo instead of this, determine which is next by examining block height
      for (var i = 0; i < products.length; i++) {
        current = products[i];
        cursor = i % this.data.columnCount; // which column?
        tempColumns[cursor].column.push(current);
      }

      // reset column data
      this.setData({
        _columns: tempColumns
      });
    },

    /**
     * Reset with some new array of products (if provided)
     */
    resetProducts: function (products) {
      this._init();
      if (products) {
        this.addProducts(products);
      }
    },

    /**
     * Initialzie internal representation of each column.
     */
    _init: function () {
      var temp = [];
      for (var i = 0; i < this.data.columnCount; i++) {
        // Adding a id field because according to tencent
        // this helps with performance.
        // But it's ugly as hell. -ryan
        temp[i] = {
          "id": i,
          "column": []
        };
      }
      this.setData({
        _columns: temp
      });
    }
  },

  ready() {
    this._init();
  }
});
