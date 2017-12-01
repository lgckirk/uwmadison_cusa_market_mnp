//index.js
//主页面
const app = getApp()

Page({
  data: {

    //check
    userInfo: null,
    check: null,
    
    iconArray: [
    {checkImage: '/pages/index/image/ESPTicon.png' ,
    checkName: '二手市场-买'},
    {
      checkImage: '/pages/index/image/RMPicon.png',
      checkName: '敬请期待'
    },
    {
      checkImage: '/pages/index/image/ESPT2.png',
      checkName: '二手市场-卖'
    },

    ],

    bigTitle: '/pages/index/image/BigTitle-01.png'
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var app = getApp();

    wx.login({
      success: function (res) {
        console.log(res.errMsg)
        console.log(res.code)
        if (res.code) {
          //发起网络请求userID
          wx.request({
            url: 'https://mnpserver.uwmadisoncusa.com/LoginExecute.php',
            data: {
              LoginCode: res.code
            },
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded",
            },
            success: function (res) {
              console.log("Result of UserID");
              console.log(res);             
              var userID = parseInt(res.data.UserId);
              app.globalData.userInfo = userID;
              console.log(app.globalData.userInfo);

            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  },

  //jump to RMP
  jumpToRMP: function () {
    wx.navigateTo({
      url: '/pages/rmp/rmp-home'
    })
  },

  //jump to RMP
  jumpTo2S: function () {
    wx.navigateTo({
      url: '/pages/2s/2s'
    })
  },

  //jump to RMP
  jumpToPo: function () {
    wx.navigateTo({
      url: '/pages/2s/fl/po'
    })
  },


  postProduct: function(){
    //get userInfo
    var app = getApp();
  
    var uid = app.globalData.userInfo;
    
    this.data.userInfo = uid;



    //测试PostProduct
    wx.request({
      url: 'https://mnpserver.uwmadisoncusa.com/MarketExecute.php',
      data: {
        Action: "PostProduct",
        ProductOwner: this.data.userInfo,
        ProductName: "Mac air 13 inch",
        ProductType: 1,
        ProductDescription: "很好很好",
        ProductCondition: "昨天刚买的，全新未开封",
        ProductPrice: 1200
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function(res){
        console.log(res.data)
      }
    })
  },
  
  onPullDownRefresh: function () {
   
    wx.stopPullDownRefresh()
  }

})