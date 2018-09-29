Page({
  data: {
    productTypes: {
      furniture: {
        id: 2,
        name: '家具',
        iconUrl: '/images/usedItemMarket/buy/typeIcons/furniture.png'
      },
      electronics: {
        id: 3,
        name: '电子',
        iconUrl: '/images/usedItemMarket/buy/typeIcons/electronics.png'
      },
      academic: {
        id: 4,
        name: '学术',
        iconUrl: '/images/usedItemMarket/buy/typeIcons/academic.png'
      },
      daily: {
        id: 5,
        name: '衣橱',
        iconUrl: '/images/usedItemMarket/buy/typeIcons/daily.png'
      },
      housing: {
        id: 6,
        name: '租房',
        iconUrl: '/images/usedItemMarket/buy/typeIcons/housing.png'
      },
      travel: {
        id: 7,
        name: '交通',
        iconUrl: '/images/usedItemMarket/buy/typeIcons/travel.png'
      },
      makeup: {
        id: 8,
        name: '化妆',
        iconUrl: '/images/usedItemMarket/buy/typeIcons/makeup.png'
      },
      others: {
        id: 1,
        name: '杂物',
        iconUrl: '/images/usedItemMarket/buy/typeIcons/others.png'
      }
    }
  },

  /**
   * Jump to the product list page represented by typeKey
   * @param object event The tap event object
   */
  jumpToProductList(event) {
    var typeKey = event.target.id;
    if (!this.data.productTypes[typeKey]) {
      console.error('Page.market.jumpToProductList("' + typeKey + '"): invalid argument');
      return;
    }

    var typeId = JSON.stringify(this.data.productTypes[typeKey].id);
    wx.navigateTo({
      url: '/pages/market/productList/productList?typeID=' + typeId
    });
  },

  // disable pulling down
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})