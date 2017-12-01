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
      img:'/pages/2s/img/mai-01.png',
      img1: '/pages/2s/img/中-01.png',
      img2: '/pages/2s/img/po-01.png',
      productId: 0,
      wx: null,
      phone: null,
      email: null,
      contact: null,

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

    console.log(this.data.name);
  },

  inputType: function (e) {
    this.setData({
      type: parseInt(e.detail.value)
    })

    console.log(this.data.type);
  },

  inputPrice: function (e) {
    this.setData({
      price: parseInt(e.detail.value)
    })

    console.log(this.data.price);
  },

  inputDes: function (e) {
    this.setData({
      des: String(e.detail.value)
    })

    console.log(this.data.des);
  },

  inputWx: function (e) {
    this.setData({
      wx: String(e.detail.value)
    })

    console.log(this.data.wx);
  },

  inputContact: function (e) {
    this.setData({
      contact: String(e.detail.value)
    })

    console.log(this.data.contact);
  },

  inputPhone: function (e) {
    this.setData({
      phone: String(e.detail.value)
    })

    console.log(this.data.phone);
  },

  inputEmail: function (e) {
    this.setData({
      email: String(e.detail.value)
    })

    console.log(this.data.email);
  },


  poProduct:function(){
    
   
    //get userInfo
    var app = getApp();

    var uid = app.globalData.userInfo;

    this.data.userInfo = uid;

    var page = this
    
    var go =(this.data.name!=null)&&(this.data.des!=null)&&(this.data.type!=0)&&(this.data.price!=0);
    console.log("填写情况"+go);
    console.log("Type is " + this.data.type);
    console.log("name is " + this.data.name);
    console.log("descrip is " + this.data.des);
    console.log("price is " + this.data.price);
    if(go==false)
    {
      wx.showToast({
        title: '失败',
        icon: 'loading',
        duration: 2000
      })
    }
    else{
    //测试PostProduct
    wx.request({
      url: 'https://mnpserver.uwmadisoncusa.com/MarketExecute.php',
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
        console.log(res.data.ProductId)
        console.log("RES IS");
        console.log(res);
        
        if (res.data.ErrorCode==1){
          wx.showToast({
            title: '你成功啦',
            icon: 'success',
            duration: 2000
          })
        page.setData({
            productId: parseInt(res.data.ProductId)
        })
        console.log(res.data)
        console.log(page.data.productId)


        }

        else{
          wx.showToast({
            title: '你失败了',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    })


    

    }
  },

  poImg:function(){
    var page = this
    if (page.data.productId != 0){
    //测试PostProductImages
    wx.chooseImage({

      
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths[0])
        wx.uploadFile({
          url: 'https://mnpserver.uwmadisoncusa.com/MarketExecute.php',
          filePath: tempFilePaths[0],
          name: 'ProductImage',
          formData: {
            "Action": 'PostProductImages',
            "ProductId": page.data.productId    //assume我们已经post过至少一次了
          },
          success: function (res) {
            console.log(res.data)
            console.log(JSON.parse(res.data).ErrorCode)
            if (JSON.parse(res.data).ErrorCode == 1) {
              wx.showToast({
                title: '你成功啦',
                icon: 'success',
                duration: 2000
              })
              
            }

            else {
              wx.showToast({
                title: '你失败了 是不是没写一些东西呀',
                icon: 'loading',
                duration: 2000
              })
            }
            
          }
        })
      }
    })
    }
  },

  respondType: function (e) {
    console.log(e)
    console.log(this.data.array[e.detail.value].typeId)
    this.setData({
      index: e.detail.value,
      type: this.data.array[e.detail.value].typeId
    })
    console.log(this.data.type)
  }

  

})