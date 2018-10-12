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

        addProducts: function(products) {

            //@todo: check null
            var tempColumns = this.data._columns, 
                current,
                cursor = 0;
            for (var i = 0; i < products.length; i++) {

                // @review: as of right now the logic is limited to
                // alternating between columns. This can lead to 
                // uneven column height as number of items grows.
                // 
                // The problem here is that we can't see the future. 
                // The size of the image is unknown at the time of this method call,
                // and it will only be clear after being loaded by WeChat.
                //
                // To solve this we can return the size of the image with
                // the API, and maintain a list of height of each column,
                // and add the item to the colum with least height. 
                // However this does involve API change. -ryan
                current = products[i];
                cursor = i % this.data.columnCount; // which column?
                tempColumns[cursor].column.push(current);
            }

            // @review: is this expensive with more data?
            // Does WeChat try to re-render old items as well? -ryan
            this.setData({
                _columns: tempColumns
            });
        }
    },

    /**
     * Create internal representation of each column.
     */
    ready() {

        var temp = [];
        for(var i = 0; i < this.data.columnCount; i++) {

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

});
