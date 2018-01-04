Page({
  data: {
    name:null,
    type:2,
    price:null,
    des:null,
    productId: 0,
    wx: null,
    phone: null,
    email: null,
    contact: null,
    imageBuffer: null,
    error: "",
    index: 0,
    hideSubmission: true,
    loadingHidden: false,
    typeMap: [
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
      }
    ],
  },

  onLoad: function (options) {
  },

  onReady: function () {
  },

  onShow: function () {
    var app = getApp();
    var page = this;
    if (!app.globalData.userInfo) {
      var userCheck = setInterval(function() {
        if (app.globalData.userInfo) {
          clearInterval(userCheck);
          page.setData({
            loadingHidden: true
          });
        }
      }, 100);
    }
    else {
      if (!page.data.loadingHidden) {
        page.setData({
          loadingHidden: true
        });
      }
    }
  },

  onHide: function () {
  },

  onUnload: function () {
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  onReachBottom: function () {
  },

  onShareAppMessage: function () {
  },

  inputName: function(e){
    this.setData({
      name: String(e.detail.value).trim()
    })      
  },

  inputType: function (e) {
    this.setData({
      type: parseInt(e.detail.value)
    })
  },

  inputPrice: function (e) {
    var n = e.detail.value;
    if (!isNaN(parseFloat(n)) && isFinite(n)) {
      this.setData({
        price: parseFloat(e.detail.value)
      }) 
    }
  },

  inputDes: function (e) {
    this.setData({
      des: String(e.detail.value).trim()
    })    
  },

  inputWx: function (e) {
    this.setData({
      wx: String(e.detail.value).trim()
    })
  },

  inputContact: function (e) {
    this.setData({
      contact: String(e.detail.value).trim()
    })
  },

  inputPhone: function (e) {
    this.setData({
      phone: String(e.detail.value).trim()
    })
  },

  inputEmail: function (e) {
    this.setData({
      email: String(e.detail.value).trim()
    })
  },

  /* 多次上传图片 */
  uploadMultiple: function(imageArray, productId, success, failure){
    var page = this;
    //如果没有图片需要上传 成功
    if (!imageArray || imageArray.length <= 0){
      success();
      return;
    }
    //如果有需要上传的图片
    //则一张一张的上传
    wx.uploadFile({
      url: 'https://madishare.com/MarketExecute.php',
      filePath: imageArray.shift(),
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

  /* 执行Post */
  poProduct:function(){
    var app = getApp();
    var page = this;

    var err = "";
    if (page.data.name == null || page.data.des == null ||
        page.data.name == "" || page.data.des == "" ||
        page.data.price == null)
    {
      err = "商品名称，描述，价格为必填。价格需为数字。";
    }
    else if (page.data.price < 0)
    {
      err = "价格不能是负数。";
    }
    else if (page.data.name == "null" || page.data.des == "null" ||
        page.data.wx == "null" || page.data.contact == "null" ||
        page.data.email == "null" || page.data.phone == "null")
    {
      err = "物品信息包含非法字符，请检查一下。";
    }
    else if (page.data.name.length > 11)
    {
      err = "物品名称不能超过11个字符。";
    }
    else if (page.data.contact != null && page.data.contact.length > 15)
    {
      err = "联系人名字不能超过15个字符。";
    }
    else if (page.data.phone != null && page.data.phone.length > 15)
    {
      err = "联系人电话不能超过15个字符。";
    }
    else if (String(page.data.price).length > 7)
    {
      err = "物品价格超过限额。";
    }
    
    //如果任何数据填写错误 回馈失败
    if(err != "")
    {
      wx.showToast({
        title: "失败",
        icon: 'loading',
        duration: 1000
      });
      this.setData({error: err});
    }
    //如果数据填写成功
    else if (page.data.hideSubmission){
      //Post Product 指令
      this.setData({hideSubmission: false});
      wx.request({
        url: 'https://madishare.com/MarketExecute.php',
        data: {
          Action: "PostProduct",
          ProductOwner: app.globalData.userInfo,
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
          // 上传成功的函数
          var success = function(){
            setTimeout(function(){
              //redirect
              wx.switchTab({
                url: "/pages/myProduct/myProduct",
                success: function(e) {
                  var page = getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onLoad(); 
                }
              });
            }, 1500);

            // hide loading box
            page.setData({
              error: "",
              hideSubmission: true
            });

            // show toast
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 1500
            });
          };

          // 如果上传失败
          var failure =  function(){
            // hide loading box
            page.setData({
              error: "",
              hideSubmission: true
            });
            // show toast
            wx.showToast({
              title: '失败',
              icon: 'loading',
              duration: 1500
            })
          };

          //根据结果进行反馈
          if (res.data.ErrorCode==1){
            //成功上传信息 开始进行图片上传 使用imageBuffer
            page.uploadMultiple(page.data.imageBuffer, res.data.ProductId, success, failure);  
          } else{
            //失败
            failure();
          }
        },

        fail: function() {
          page.setData({
            error: "",
            hideSubmission: true
          });
          wx.showToast({
            title: '失败',
            icon: 'loading',
            duration: 1500
          });
        }
      })
    }
  },

  //选择多张图片进行上传
  //将图片保存在imageBuffer
  chooseImg:function(){
    var page = this;
    wx.chooseImage({
      count: 4,
      sizeType: ['compressed'],
      success: function (res) {
        page.setData({'imageBuffer': res.tempFilePaths});
      }
    });
  },

  respondType: function (e) {
    this.setData({
      index: e.detail.value,
      type: this.data.typeMap[e.detail.value].typeId
    })
  }
})