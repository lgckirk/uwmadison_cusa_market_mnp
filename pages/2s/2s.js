Page({
  data: {
    iconArray: [
      {
        checkImage: '/images/usedItemMarket/buy/typeIcons/furniture.png',
        checkName: '家具',
        typeID: "2"
      },
      {
        checkImage: '/images/usedItemMarket/buy/typeIcons/electronics.png',
        checkName: '电子',
        typeID: "3"
        
      },
      {
        checkImage: '/images/usedItemMarket/buy/typeIcons/academic.png',
        checkName: '学术',
        typeID: "4"
      },
      {
        checkImage: '/images/usedItemMarket/buy/typeIcons/daily.png',
        checkName: '衣橱',
        typeID: "5"
      },
      {
        checkImage: '/images/usedItemMarket/buy/typeIcons/housing.png',
        checkName: '租房',
        typeID: "6"
      },
      {
        checkImage: '/images/usedItemMarket/buy/typeIcons/travel.png',
        checkName: '交通',
        typeID: "7"
      },
      {
        checkImage: '/images/usedItemMarket/buy/typeIcons/makeup.png',
        checkName: '化妆',
        typeID: "8"
      },
      {
        checkImage: '/images/usedItemMarket/buy/typeIcons/others.png',
        checkName: '杂物',
        typeID: "1"
      },
    ],
    titleImg: '/images/usedItemMarket/buy/title.png'
  },

  onLoad: function (options) {
  },

  onReady: function () {
  },

  onShow: function () {
  },

  onHide: function () {
  },

  onUnload: function () {
  },

  onReachBottom: function () {
  },

  onShareAppMessage: function () {
  },

  // TODO: change function names
  jumpTocf1: function () {
    wx.navigateTo({
      url: '/pages/2s/productList/cf?typeID=' + JSON.stringify(this.data.iconArray[0].typeID)
    })
  },

  jumpTocf2: function () {
    wx.navigateTo({
      url: '/pages/2s/productList/cf?typeID=' + JSON.stringify(this.data.iconArray[1].typeID)
    })
  },

  jumpTocf3: function () {
    wx.navigateTo({
      url: '/pages/2s/productList/cf?typeID=' + JSON.stringify(this.data.iconArray[2].typeID)
    })
  },

  jumpTocf4: function () {
    wx.navigateTo({
      url: '/pages/2s/productList/cf?typeID=' + JSON.stringify(this.data.iconArray[3].typeID)
    })
  },

  jumpTocf5: function () {
    wx.navigateTo({
      url: '/pages/2s/productList/cf?typeID=' + JSON.stringify(this.data.iconArray[4].typeID)
    })
  },

  jumpTocf6: function () {
    wx.navigateTo({
      url: '/pages/2s/productList/cf?typeID=' + JSON.stringify(this.data.iconArray[5].typeID)
    })
  },

  jumpTocf7: function () {
    wx.navigateTo({
      url: '/pages/2s/productList/cf?typeID=' + JSON.stringify(this.data.iconArray[6].typeID)
    })
  },

  jumpTocf0: function () {
    wx.navigateTo({
      url: '/pages/2s/productList/cf?typeID=' + JSON.stringify(this.data.iconArray[7].typeID)
    })
  },

  /* disable pulling down */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  }
})