Page({
  data: {
    productImages: [],
    product: null
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  onLoad: function(options){
    var app = getApp();
    // retrieve this product
    var p = app.globalData.products[JSON.parse(options.index)];
    this.setData({
      product : p,
      productImages: p.ProductImages
    })

    // if no image associated, give it a default one
    if (this.data.productImages.length == 0) {
      this.setData({
        productImages: ["/images/usedItemMarket/buy/noPicture.png"]
      });
    }
  },

  /* pop up window for contact */
  popUp: function () {
    var app = getApp();
    var contact = this.data.product.ProductContact;
    var wechat = '木有';
    var email = '木有';
    var name = '木有';
    var phone = '木有';
    console.warn(contact.ContactName != "null")

    if (contact.ContactName != null
        && contact.ContactName != ""
        && contact.ContactName != "null")
    {
      name = contact.ContactName;
    }
    if (contact.ContactEmail != null
      && contact.ContactEmail != ""
      && contact.ContactEmail != "null")
    {
      email = contact.ContactEmail;
    }
    if (contact.ContactPhone != null
      && contact.ContactPhone != ""
      && contact.ContactPhone != "null")
    {
      phone = contact.ContactPhone;
    }
    if (contact.ContactWechat != null
      && contact.ContactWechat != ""
      && contact.ContactWechat != "null")
    {
      wechat = contact.ContactWechat;
    }

    var info = '姓名:'+name+' 微信：'+wechat+' 邮箱：'+email+' 手机：'+phone;
    wx.showModal({
      title: '复制联系方式到剪切板？',
      content: info,
      cancelText: '取消',
      cancelColor: '#99FF99',
      confirmText: '复制',
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



 //图片点击事件
 imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    if (src === "/images/usedItemMarket/buy/noPicture.png")
    {
      wx.showToast({
        title: '无预览',
        icon: 'loading',
        duration: 600
      })
    }
    
    else{
      //图片预览
        wx.previewImage({
          current: src, // 当前显示图片的http链接
          urls: imgList // 需要预览的图片http链接列表
      })
    }
  }
})