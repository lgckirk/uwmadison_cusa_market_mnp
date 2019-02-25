import Product from "../../models/Product";
import URL from "URL";
import wxp from "wxp";

/** @review
 * Promisified function for user login
 * Also can be used to check existence of globalData.userInfo
 * @param config (Optional): the globalData object used to automatically store the retrieved UserID 
 * @promise resolve: UserId (unique) from server
 * @promise reject:  Fail to generate wx code or fail to retrieve UserId from server
 */
function getUserId(globalData){ 
  return new Promise(function(resolve, reject){
    let app = getApp();
    // In case userId already exists
    if (app && app.globalData.userInfo) {
      resolve(app.globalData.userInfo);
      return;
    }
    if (getUserId._loginConnection != undefined ) { // detect ongoing login request
      resolve(getUserId._loginConnection);
      return;
    }
    // static variable for storing ongoing login request
    getUserId._loginConnection = wxp._loginCodePromise()
    .then((code)=>{
      // console.log(code);
      return wxp._requestPromise(URL._loginUrl, {"LoginCode": code});
    })
    .then((data)=>{
      console.log(data);
      // refresh the app object in case it has not been instantiated when promise is setup
      app = getApp(); 
      // in case app object has not been instantiated, update the config used to set up the app obj
      if (globalData) globalData.userInfo = data.UserId;
      if (app) app.globalData.userInfo = data.UserId;
      // clear the cached server request
      delete getUserId._loginConnection;
      return data.UserId;
    })
    .catch((err)=>{
      // still clear the cache if err occurs
      delete getUserId._loginConnection;
      throw err;

    })
    resolve(getUserId._loginConnection);
  })
}


export default { getUserId };