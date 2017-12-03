 // rmp-home.js
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    iconArray: [
      {
        checkImage: '/pages/index/image/RMP ICONS/BUS.png',
        checkName: '二手市场'
      },
      {
        checkImage: '/pages/index/image/RMP ICONS/ns.png',
        checkName: '二手市场'
      },
      {
        checkImage: '/pages/index/image/RMP ICONS/ps.png',
        checkName: '二手市场'
      },
      {
        checkImage: '/pages/index/image/RMP ICONS/ss.png',
        checkName: '二手市场'
      },
      {
        checkImage: '/pages/index/image/RMP ICONS/human.png',
        checkName: '二手市场'
      },
      {
        checkImage: '/pages/index/image/RMP ICONS/lan.png',
        checkName: '二手市场'
      },
      {
        checkImage: '/pages/index/image/RMP ICONS/l.png',
        checkName: '二手市场'
      },
      {
        checkImage: '/pages/index/image/RMP ICONS/bs.png',
        checkName: '二手市场'
      },
    ],

    titleImg:'/pages/index/image/RMPTitle-01-01.png'
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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
  jumpToBus: function () {
    wx.navigateTo({
      url: '/pages/rmp/business'
    })
  }


})