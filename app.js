import util from "/lib/utility";
import moment from "/lib/moment";
App({
  globalData: {
    // user ID sent by our server
    userInfo: null,
    // a session variable holding a list of products (cross-page)
    products: [],
    enableImage: true
  },
  /**
   * Obtain user ID
   */
  onLaunch: function(options) {
    moment.locale('zh-cn');
    util.getUserId()
    .then(res=>this.globalData.userInfo = res)
    .catch(function(err){
      console.log("Error obtaining ID");
      console.log(err);
    })    
  }
})
