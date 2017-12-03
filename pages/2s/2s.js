// 2s.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconArray: [
      {
        checkImage: '/pages/2s/img/icons/jj.png',
        checkName: '家具',
        typeID: "2"
      },
      {
        checkImage: '/pages/2s/img/icons/dn.png',
        checkName: '电子',
        typeID: "3"
        
      },
      {
        checkImage: '/pages/2s/img/icons/xs.png',
        checkName: '学术',
        typeID: "4"
      },
      {
        checkImage: '/pages/2s/img/icons/yf.png',
        checkName: '衣服',
        typeID: "5"
      },
      {
        checkImage: '/pages/2s/img/icons/fz.png',
        checkName: '租房',
        typeID: "6"
      },
      {
        checkImage: '/pages/2s/img/icons/jt.png',
        checkName: '交通',
        typeID: "7"
      },
      {
        checkImage: '/pages/2s/img/icons/hz.png',
        checkName: '化妆',
        typeID: "8"
      },
      {
        checkImage: '/pages/2s/img/icons/zw.png',
        checkName: '杂物',
        typeID: "1"
      },
      
    ],

    titleImg: '/pages/index/image/2sTitle-01-01.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

 

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //jump to RMP
  jumpTocf1: function () {
    wx.navigateTo({
      url: '/pages/2s/fl/cf?typeID=' + JSON.stringify(this.data.iconArray[0].typeID)
    })
  },

  jumpTocf2: function () {
    wx.navigateTo({
      url: '/pages/2s/fl/cf?typeID=' + JSON.stringify(this.data.iconArray[1].typeID)
    })
  },

  jumpTocf3: function () {
    wx.navigateTo({
      url: '/pages/2s/fl/cf?typeID=' + JSON.stringify(this.data.iconArray[2].typeID)
    })
  },

  jumpTocf4: function () {
    wx.navigateTo({
      url: '/pages/2s/fl/cf?typeID=' + JSON.stringify(this.data.iconArray[3].typeID)
    })
  },

  jumpTocf5: function () {
    wx.navigateTo({
      url: '/pages/2s/fl/cf?typeID=' + JSON.stringify(this.data.iconArray[4].typeID)
    })
  },

  jumpTocf6: function () {
    wx.navigateTo({
      url: '/pages/2s/fl/cf?typeID=' + JSON.stringify(this.data.iconArray[5].typeID)
    })
  },

  jumpTocf7: function () {
    wx.navigateTo({
      url: '/pages/2s/fl/cf?typeID=' + JSON.stringify(this.data.iconArray[6].typeID)
    })
  },

  jumpTocf0: function () {
    wx.navigateTo({
      url: '/pages/2s/fl/cf?typeID=' + JSON.stringify(this.data.iconArray[7].typeID)
    })
  },

  onPullDownRefresh: function () {
    
    wx.stopPullDownRefresh()
  }


})