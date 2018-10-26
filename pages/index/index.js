import util from "../../lib/utility";
import Product from "../../models/Product";

const app = getApp();

Page({
  data: {
    loginFinished: false,
    items: [] // @test
  },

  onLoad: function () {
  },

  onShow: function() {

      // @test: this is just mock data -ryan
      let mockData = 
          [{
                ProductId: 1,
                ProductName: "Lucky 2B2B 明年转租",
                DateCreated: "2013-02-08 09:30:26",
                ProductImages: ["https://lucky.stevebrownapts.com/wp-content/uploads/2016/04/Lucky-1320-CNP-1024x683.jpg"]
            },
            {
                ProductId: 2,
                ProductName: "兰蔻小黑瓶 全新未拆封 机场购入",
                DateCreated: "2018-02-08 19:40:24",
                ProductImages: ["http://p1.ol-img.com/product/400x400/1/81/56ab1bad2e92a.jpg"]
            },
            {
                ProductId: 3,
                ProductName: "这个啥玩意 不知道从哪里翻出来的 卖掉算了",
                DateCreated: "2018-02-08 19:40:24",
                ProductImages: ["http://p1.ol-img.com/product/400x400/1/81/56ab1bad2e92a.jpg"]
            },
            {
                ProductId: 4,
                ProductName: "iPhone XS 全新不想要两块钱送了",
                DateCreated: "2018-10-08 09:30:26",
                ProductImages: ["https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-Xs-line-up-09122018_inline.jpg.large.jpg"]
            }
          ];

        let products = mockData.map((x) => new Product(x));
        this.setData({
            items: products
        });

      // wx.request({
      //     url: app.getServerUrl("market"),
      //     data: { "Action": "GetProductsByType", "TypeId": 2 }, // @test
      //     method: "POST",
      //     header: {
      //         "content-type": "application/x-www-form-urlencoded",
      //     },
      //     dataType: "json",
      //     success: (res) => {
      //         let json = res.data.Products;
      //         let products = json.map((x) => new Product(x))
      //         this.setData({
      //             items: products
      //         });
      //     }
      // });
  },

    onReady: function() {

        const component = this.selectComponent('#index-waterfall');
        component.addProducts(this.data.items);
    },

  jumpToMarket: util.getPageJumpCallback('/pages/market/market'),

  jumpToPostProduct: util.getPageJumpCallback('/pages/market/postProduct/postProduct'),
  
  // disable pull down
  onPullDownRefresh: function () {

      //@test: not real pull down refresh
      const component = this.selectComponent('#index-waterfall');
      component.addProducts(this.data.items);

      wx.stopPullDownRefresh()
  }
})
