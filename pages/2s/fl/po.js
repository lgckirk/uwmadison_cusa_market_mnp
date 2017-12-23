// po.js
Page({
  /**
   * 页面的初始数据
   */
   data: {
    name:null,
    type:2,
    price:0,
    des:null,
    userInfo:0,
    img:'/pages/2s/img/tu-01.png',
    img1: '/pages/2s/img/中-01.png',
    img2: '/pages/2s/img/mai-01.png',
    productId: 0,
    wx: null,
    phone: null,
    email: null,
    contact: null,
    imageBuffer: null,
    titleImg:'/pages/2s/img/poTitle-01.png',

    index: 0,
    array: [
    {
      typeId:2,
      name:'家具'
    },

    {
      typeId: 3,
      name: '电子产品'
    },

    {
      typeId: 4,
      name: '学术'
    },

    {
      typeId: 5,
      name: '衣橱衣服'
    },

    {
      typeId: 6,
      name: '租房'
    },

    {
      typeId: 7,
      name: '交通用品'
    },

    {
      typeId: 8,
      name: '化妆品'
    },

    {
      typeId: 1,
      name: '其他'
    },



    ],


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
    wx.stopPullDownRefresh();
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


   inputName: function(e){
    this.setData({
      name: String(e.detail.value)
    })

    
  },

  inputType: function (e) {
    this.setData({
      type: parseInt(e.detail.value)
    })

   
  },

  inputPrice: function (e) {
    this.setData({
      price: parseInt(e.detail.value)
    })

    
  },

  inputDes: function (e) {
    this.setData({
      des: String(e.detail.value)
    })

    
  },

  inputWx: function (e) {
    this.setData({
      wx: String(e.detail.value)
    })

   
  },

  inputContact: function (e) {
    this.setData({
      contact: String(e.detail.value)
    })

    
  },

  inputPhone: function (e) {
    this.setData({
      phone: String(e.detail.value)
    })

   
  },

  inputEmail: function (e) {
    this.setData({
      email: String(e.detail.value)
    })

    
  },

  //多次上传图片
  uploadMultiple: function(imageArray, productId, success, failure){
    var page = this;
    //如果没有图片需要上传 成功
    if (!imageArray || imageArray.length<=0){
      success();
      return;
    }

    //如果有需要上传的图片
    //则一张一张的上传
    wx.uploadFile({
      url: 'https://madishare.com/MarketExecute.php',
      filePath: imageArray.pop(),
      name: 'ProductImage',
      formData: {
        "Action": 'PostProductImages',
            "ProductId": productId   
          },
          //若成功上传一张图片 进行recursion
          success: function (res) {
            if (JSON.parse(res.data).ErrorCode == 1) {
              page.uploadMultiple(imageArray, productId, success, failure);
            } else {
              failure();
            }
          }
    });
  },



  poProduct:function(){
    //get userInfo
    var app = getApp();

    var uid = app.globalData.userInfo;

    this.data.userInfo = uid;

    var page = this
    
    var go =(this.data.name!=null)&&(this.data.des!=null)&&(this.data.type!=0)&&(this.data.price!=0);
    

    //如果任何数据填写错误 回馈失败
    if(go==false)
    {
      wx.showToast({
        title: '失败',
        icon: 'loading',
        duration: 2000
      })
    }


    //如果数据填写成功
    else{
    
    //Post Product 指令
    wx.request({
      url: 'https://madishare.com/MarketExecute.php',
      data: {
        Action: "PostProduct",
        ProductOwner: this.data.userInfo,
        ProductName: this.data.name,
        ProductType: this.data.type,
        ProductDescription: this.data.des,
        ProductCondition: null,
        ProductPrice: this.data.price,
        ContactName: this.data.contact,
        ContactPhone: this.data.phone,
        ContactEmail: this.data.email,
        ContactWechat: this.data.wx
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
      
        //如果成功上传
        var success = function(){

          setTimeout(function(){ 
           wx.switchTab({
            url: "/pages/self/self"});}, 1500);
          wx.showToast({
            title: '你成功啦',
            icon: 'success',
            duration: 2000
          });

        };

        //如果上传失败
        var failure =  function(){
          wx.showToast({
            title: '你失败了 是不是没写一些东西呀',
            icon: 'loading',
            duration: 2000
          })
        };


        //根据结果进行反馈
        if (res.data.ErrorCode==1){
          //成功上传信息 开始进行图片上传
          //使用imageBuffer
          page.uploadMultiple(page.data.imageBuffer, res.data.ProductId, success, failure);  
        } else{
          //失败
          failure();
        }
      }
    })
  }
},

//选择多张图片进行上传
//将图片保存在imageBuffer
chooseImg:function(){
  var page = this;
  wx.chooseImage({
    success: function (res) {
      page.setData({'imageBuffer': res.tempFilePaths});
    }
  });
},

respondType: function (e) {
 
  this.setData({
    index: e.detail.value,
    type: this.data.array[e.detail.value].typeId
  })
  
}



})