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
 import util from "../../lib/utility";
Component({
  properties: {
    "columnCount": {
      type: Number,
      value: 2
    },
    "editable": {
      type: Boolean,
      value: false
    }
  },

  data: {
    _columns: []
  },

  methods: {
    addProducts: function (products) {
      if (!this._init.initialized) _init();
      let dims = products.map(p=>p.productDims?p.productDims:null);
      var tempColumns = this.data._columns,current;
      if (!products || products.length==0)
        return new Promise((res, rej)=>res());
      console.log(dims);
      return new Promise(res=>res())
      .then(()=>{
        for (var i = 0; i < products.length; i++) {
          current = products[i];
          if (dims[i] == null){
            current.productImages[0] = "/images/noPicture.png";
            dims[i] = {Width: 100, Height: 100};
          }
          // Always add product to the column with the min height
          let minHeight = Math.min(...tempColumns.map(c=>c.height));
          let targetCol = tempColumns.find(c=>(c.height == minHeight));
          targetCol.column.push(current);
          targetCol.height += dims[i].Height * 100/dims[i].Width;
        }
        // Does WeChat try to re-render old items as well? -ryan
        this.setData({_columns: tempColumns});
      })
    },
    /**
     * Reset with some new array of products (if provided)
     */
    resetProducts: function (products) {
      this._init();
      return this.addProducts(products);
    },
    /**
     * Initialzie internal representation of each column.
     */
    _init: function () {
      this._init.initialized  = true;
      var temp = [];
      for (var i = 0; i < this.data.columnCount; i++) {
        // Adding a id field because according to tencent
        // this helps with performance.
        // But it's ugly as hell. -ryan
        temp[i] = {
          "id": i,
          "column": [],
          "height": 0
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
