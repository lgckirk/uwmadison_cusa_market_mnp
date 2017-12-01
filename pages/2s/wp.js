Page({
  data: {
    imgUrls: [
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    img: '/pages/2s/img/lxw.png',

    
    
    iconArray: null,
    index: 0,
    
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onLoad: function(options){
    var self = this

    var m = (JSON.parse(options.index))
    console.log("original transfer" + options.index)
    var app = getApp();
    //console.log("this is globalDdata"+iconArray);

    self.setData({
      index: m,
      //iconArray: app.globalData.iconArray[m]
    })


    //测试GetProductImages
    wx.request({
      url: 'https://mnpserver.uwmadisoncusa.com/MarketExecute.php',
      data: {
        Action: "GetProductImages",
        ProductId: app.globalData.iconArray[m].ProductId    //assume我们已经post过至少一次了
      },
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      success: function (res) {


        self.setData({
          iconArray: app.globalData.iconArray[m]
        })
        console.log(res.data.ProductImages)

        if(res.data.ProductImages.length==0){
          var check = res.data.ProductImages;
          check.push('/pages/2s/img/无预览2.png')
          self.setData({

            imgUrls: check
          })
        }

        else{
          self.setData({
            
            imgUrls: res.data.ProductImages
          })
        }
      }
    })
  },



  toast: function () {
    var text = '1111'
    var app = getApp();
    var product = app.globalData.iconArray[this.data.index]
    var wxh = '木有';
    var e = '木有';
    var Name = '木有';
    var phone = '木有';
    if (product.ContactName!=undefined){
      Name = product.ContactName;
    }
    if (product.ContactEmail!= undefined) {
      e = product.ContactEmail;
    }
    if (product.ContactPhone!= undefined) {
      phone = product.ContactPhone;
    }
    if (product.ContactWechat!= undefined) {
      wx = product.ContactWechat;
    }

    var info = '姓名:'+Name+' 微信：'+wxh+' 邮箱：'+e+' 手机：'+phone;
    console.log(info);

    wx.showModal({
      title: '要不要联系我？'+this.data.info,
      content: '点击 “要！！！” 将微信号复制到剪贴板',
      cancelText: '不要。。',
      cancelColor: '#99FF99',
      confirmText: '要！！！',
      confirmColor: '#BD1E2D',
      
      success: function (res) {
        if (res.confirm) {
          wx.setClipboardData({ 
            data: info,
            success:function(res){
              wx.showToast({
                title: '已复制到剪贴板',
                icon: 'success',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },





  
})