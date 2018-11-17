App({
  globalData: {
    // user ID sent by our server
    userInfo: null,
    // a session variable holding a list of products (cross-page)
    products: [],
    //Global config for product types
    metaProductTypes: ['日用家具', '电子产品', '学术用品', '衣橱衣服', '房屋转租', '交通用品', '美妆护肤', '其他宝贝'],
  },
  /**
   * Returns url of the server to commmunicate with.
   * @param String purpose What you want to do
   * @return String url in interest
   */
  getServerUrl: function(purpose) {
      
    // @submit: madishare down, temporary change
      var purposeToUrl = {
        login: "https://madishare.com/LoginExecute.php",
        market: "http://testcusa-env.afejb3cmmd.us-east-2.elasticbeanstalk.com/MarketExecute.php"  
      };

    if (!purposeToUrl[purpose]) {
      console.error("App.getServerUrl('" + purpose + "'): invoked with invalid argument");
      return null;
    } else {
      return purposeToUrl[purpose];
    }
  }
})
