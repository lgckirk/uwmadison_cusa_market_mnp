// 2s.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    iconArray: [
      {
        checkImage: '/pages/2s/fl/1.jpg',
        checkName: '商品1',
        price: '不要钱'
      },

    ],
    spaces: [1, 2 ,3, 4, 5],
    iconImg: [],
    loadingHidden: false, 
    titleImg: '/pages/index/image/2sTitle-01-01.png'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var app = getApp();

    //测试GetProductsByType
    var page = this;
    //测试GetProductsByUserId
    var userCheck = setInterval(function(){ 
      console.log("in loop");
      if (app.globalData.userInfo){
            wx.request({
              url: 'https://mnpserver.uwmadisoncusa.com/MarketExecute.php',
              data: {
                Action: "GetProductsByUserId",
                UserId: app.globalData.userInfo
              },
              method: "POST",
              header: {
                "content-type": "application/x-www-form-urlencoded",
              },
              success: function(res){
                console.log(res);
                page.setData({
                  iconArray: res.data.Products
                })
                var spaces = [];
                for (var i=0; i< 5 - res.data.Products.length;i++){
                    spaces.push("1");
                }
                page.setData({spaces: spaces});
                page.setData({loadingHidden: true});
              } 
            })
          clearInterval(userCheck);
      }   
    }, 100);
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


  jumpTowp: function (num) {
    var app = getApp();
    app.globalData.iconArray = this.data.iconArray;

    wx.navigateTo({
      url: '/pages/2s/wp?index=' + JSON.stringify(num.target.id)
    })
  },

  offProduct: function(num){
    var page = this;
    //测试GetProductsByUserId
    wx.request({
      url: 'https://mnpserver.uwmadisoncusa.com/MarketExecute.php',
      data: {
        Action: "EndListing",
        ProductId: page.data.iconArray[num.target.id].ProductId
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function(res){
        wx.startPullDownRefresh()
      }
    }) 

  },



  onPullDownRefresh: function () {
    var app = getApp();
    //测试GetProductsByType
    var page = this;
    //测试GetProductsByUserId
    wx.request({
      url: 'https://mnpserver.uwmadisoncusa.com/MarketExecute.php',
      data: {
        Action: "GetProductsByUserId",
        UserId: app.globalData.userInfo
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res);
        page.setData({
          iconArray: res.data.Products
        })
        var spaces = [];
        for (var i=0; i< 5 - res.data.Products.length;i++){
            spaces.push("1");
        }
        page.setData({spaces: spaces});        
        wx.stopPullDownRefresh()
      }
    })
    
  },
  jumpToPo: function() {
    wx.navigateTo({
        url: '/pages/2s/fl/po'
    });
  }

})