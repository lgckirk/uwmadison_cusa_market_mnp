// 2s.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeID: null,


    
    iconArray: [
      {
        checkImage: '/pages/2s/fl/1.jpg',
        checkName: '商品1',
        price:'不要钱'
      },
      
    ],

    iconImg: [],

    titleImg: '/pages/index/image/2sTitle-01-01.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(JSON.parse(options.typeID))

    //解析得到对象
    this.setData({      
      typeID: parseInt(JSON.parse(options.typeID))
    });
    
    

    //测试GetProductsByType
    var page = this;
    wx.request({
      url: 'https://madishare.com/MarketExecute.php',
      data: {
        Action: "GetProductsByType",
         TypeId: this.data.typeID
       },
       method: "POST",
       header: {
         "content-type": "application/x-www-form-urlencoded",
       },
       success: function(res){
         
         //console.log(res.data.Products)
         if(res.data.Products.length==0)
         {
           wx.redirectTo({
             url: '/pages/2s/fl/myl',
           })
         }
         page.setData({
           iconArray: res.data.Products
         })
         //console.log(page.data.iconArray)
      },

      complete:function(){
        var array = [];
        //console.log(page.data.iconArray.length);

        for (var i = 0; i < page.data.iconArray.length; i++) {
          //测试GetProductImages
          //console.log(i)
          if (page.data.iconArray[i].ProductImages.length != 0)
            array.push(page.data.iconArray[i].ProductImages[0]);
          else
            array.push("/pages/2s/img/WUL.png");
          page.setData({iconImg: array});
        }
      }
     })

 
    


    
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
    //测试GetProductsByType
    var page = this;
    wx.request({
      url: 'https://madishare.com/MarketExecute.php',
      data: {
        Action: "GetProductsByType",
        TypeId: this.data.typeID
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function (res) {

        //console.log(res.data.Products)
        if (res.data.Products.length == 0) {
          wx.redirectTo({
            url: '/pages/2s/fl/myl',
          })
        }
        page.setData({
          iconArray: res.data.Products
        })
        //console.log(page.data.iconArray);
      },

      complete: function () {
        var array = [];
        //console.log(page.data.iconArray.length);

        for (var i = 0; i < page.data.iconArray.length; i++) {
          //测试GetProductImages
          //console.log(i)
          if (page.data.iconArray[i].ProductImages.length != 0)
            array.push(page.data.iconArray[i].ProductImages[0]);
          else
            array.push("/pages/2s/img/WUL.png");
          page.setData({iconImg: array});
        }
      }
    })
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
    var app = getApp();
    //console.log(app.globalData.userInfo);


    //测试GetProductsByType
    var page = this;
    wx.request({
      url: 'https://madishare.com/MarketExecute.php',
      data: {
        Action: "GetProductsByType",
        TypeId: this.data.typeID
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        console.log(res.data.Products);
        //console.log(res.data.Products)
        if (res.data.Products.length == 0) {
          wx.redirectTo({
            url: '/pages/2s/fl/myl',
          })
        }
        page.setData({
          iconArray: res.data.Products
        });
        //console.log(page.data.iconArray)
      },

      complete: function () {
        var array = [];
        //console.log(page.data.iconArray.length);

        for (var i = 0; i < page.data.iconArray.length; i++) {
          //测试GetProductImages
          //console.log(i)
          if (page.data.iconArray[i].ProductImages.length != 0)
            array.push(page.data.iconArray[i].ProductImages[0]);
          else
            array.push("/pages/2s/img/WUL.png");

          page.setData({iconImg: array});
        }
      }
    })
    wx.stopPullDownRefresh()
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

 
  jumpTowp: function (num) {
    //console.log("transfered is "+ num.target)
    //console.log("transfered number is "+num.target.id)
    var app = getApp();
    app.globalData.iconArray = this.data.iconArray;
    //console.log(app.globalData.iconArray)

    wx.navigateTo({
      
      url: '/pages/2s/wp?index='+JSON.stringify(num.target.id)
    })
  }

})