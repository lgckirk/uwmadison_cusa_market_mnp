import Product from "../models/Product";
// NOTE: local variables and function names should start with "_" (不要删这条注释)

// const _marketUrl = "http://testcusa-env.afejb3cmmd.us-east-2.elasticbeanstalk.com/MarketExecute.php";
// const _loginUrl = "http://testcusa-env.afejb3cmmd.us-east-2.elasticbeanstalk.com/LoginExecute.php"
const _marketUrl = "https://madishare.com/MarketExecute.php";
const _loginUrl = "https://madishare.com/LoginExecute.php";

/** @review
 * Local function to promisify wx request 
 * @param endpoint: url of the endpoint being requested
 * @param data: POST data field for the endpoint
 * @param filePath: path of the file attached to the form (OPTIONAL)
 * @param fileNameField: form name field of the file attached (OPTIONAL) Default set to "ProductImage" 
 * @promise resolve: the response data if request completes successfully,
 * @promise reject: if either ErrorCode is set or wx fail to send the request
 */
function _requestPromise(endpoint, data, filePath, fileNameField){
  let hasFile = filePath!=undefined;
  let req = hasFile?wx.uploadFile:wx.request;
  if (fileNameField == undefined) fileNameField = "ProductImage";
  return new Promise(function(resolve, reject){
    let config = { url: endpoint,
      success: (res) => { 
        if (res.hasOwnProperty('ErrorCode') && res.ErrorCode != 1)  // Check ErrorCode if exist
            reject({ ErrorCode: res.ErrorCode,
                     ErrorMessage: res.ErrorMessage });
        resolve(res.data);  
      },
      fail: (res) => { reject (res); } 
    }
    if (!hasFile) {
      config['method'] = "POST";
      config['header'] = { "content-type": "application/x-www-form-urlencoded", };
      config['dataType'] = "json";
      config['data'] = data;
    }else{
      config['filePath'] = filePath;
      config['formData'] = data;
      config['name'] = fileNameField;
    }
    req(config);
  });
}

/**
 * Choose images (Max: 9)
 * @promise resolve: the tmp imgPaths (Array[String])
 * @promise reject: Fail to extract images
 */
function chooseImagePromise(){
  let config = {
    "count": 9, // at-most 9 images at onces selected
    "sizeType": "original",
    "sourceType": "album"
  }
  return new Promise(function(resolve, reject){
    config.success = res => {resolve(res.tempFilePaths)};
    config.fail = err => {reject(err)};
    wx.chooseImage(config);
  })
}

/**
 * Promisified wrapper for wx login
 * @promise resolve: th wx login code
 * @promise reject: Fail to generate the code
 */
function _loginCodePromise(){
  return new Promise(function(resolve, reject){
    wx.login({
      "success": function(res){
        if (!res.code) reject({"ErrorMessage": "Fail to Generate Login Code"});
        resolve(res.code);
      },
      "fail": function(){
        reject({"ErrorMessage": "Fail to Generate Login Code"});
      }
    })
  })
}

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
    getUserId._loginConnection = _loginCodePromise()
    .then((code)=>{
      return _requestPromise(_loginUrl, {"LoginCode": code});
    })
    .then((data)=>{
      // refresh the app object in case it has not been instantiated when promise is setup
      app = getApp(); 
      // in case app object has not been instantiated, update the config used to set up the app obj
      if (globalData) globalData.userInfo = data.UserId;
      if (app) app.globalData.userInfo = data.UserId;
      // clear the cached server request
      delete getUserId._loginConnection;
      resolve(data.userId);
    })
    .catch((err)=>{
      // still clear the cache if err occurs
      delete getUserId._loginConnection;
      throw err;

    })
    resolve(getUserId._loginConnection);
  })
}


/** @review
 * Query Server for my product list 
 * @param offset: request offset
 * @param offset: request pageSize
 */
function getMyProduct(offset, pageSize){
  return getUserId(getApp().globalData) // Make sure UserId is retrieved
          .then((id)=>{
            let data = {
              "Action": "GetProductsByUserId",
              "UserId": id
            };
            if (offset) data["StartId"] = offset;
            if (pageSize) data["pageSize"] = pageSize;
            return _requestPromise(_marketUrl, data);
          })
          .then((res)=>{ return (res.Products.map((x) => new Product(x))); });
}

/** @review
 * post 1 product and its images (auxiliary)
 * @param data.ProductName: String 
 * @param data.ProductType: Number
 * @param data.ProductImages: Array[String] (OPTIONAL)
 * @promise resolve: Server response
 * @promise reject: Lack of Info
 */
function _postProduct(data) {
  // Check validity
  if (!data.ProductName)
      throw { 'message': "Lack product name" };
  if (!data.ProductType)
      throw { 'message': "Lack product type" };
  data.ProductOwner = getApp().globalData.userInfo;
  // Post Product
  data["Action"] = "PostProduct";
  let postChain =  _requestPromise(_marketUrl, data);

  // Post Product Images
  if (!data.ProductImages) return postChain;
  // Extract Product Id
  postChain = postChain.then(res => {data.ProductId = res.ProductId});
  let promisePointer = 0;
  let imgConfig = { "Action": "PostProductImages"};
  for (var i=0;i<data.ProductImages.length;i++){ // post each image
      postChain = postChain.then(function(res){
          // get product id asynchronously
          imgConfig["ProductId"] = data.ProductId;  
          return _requestPromise(_marketUrl, imgConfig, data.ProductImages[promisePointer++]);
      });
  }
  return postChain;
}

/** @review
 * post multiple products and its images
 * @param data: Array of Product
 *        Product.ProductName: String 
 *        Product.ProductType: Number
 *        Product.ProductOwner: Number (app.globalData.userInfo)
 *        Product.ProductImages: Array[String] (OPTIONAL)
 * @promise resolve: Server response
 * @promise reject: Lack of Info
 */
function postProducts(data) {
  let productLine = getUserId();
  let postPointer = 0;
  for (var i=0;i<data.length;i++){
      productLine = productLine.then(function(res){
        return _postProduct(data[postPointer++]);
      });
  }
  return productLine;
}

/**
 * Query server and get all active products
 * @param int offset
 * @pageSize int pageSize
 * @return A promise that will be resolved with an array of Products model.
 */
function getAllActiveProducts(offset, pageSize) {
  let data = { "Action": "GetAllProducts" };
  if (offset) data["StartId"] = offset;
  if (pageSize) data["pageSize"] = pageSize;
  return _requestPromise(_marketUrl, data)
          .then(function (res) {
            return (res.Products.map((x) => new Product(x)))
          });
}

/**
 * Query server and get active produts with specified type
 * @param int typeId
 * @param int offset
 * @pageSize int pageSize
 * @return A promise that will be resolved with an array of Products model.
 */
function getProductsByType(typeId, offset, pageSize) {
  const types = _getProductTypeMapping();
  let data = {
      "Action": "GetProductsByType",
      "TypeId": typeId
  };
  if (offset) data["StartId"] = offset;
  if (pageSize) data["pageSize"] = pageSize;
  return _requestPromise(_marketUrl, data)
  .then(function(res){
    return (res.Products.map((x) => new Product(x)));
  });
}

function _getProductTypeMapping() {
  return {
    furniture: {
      id: 2,
      name: '日用家具'
    },
    electronics: {
      id: 3,
      name: '电子产品'
    },
    academic: {
      id: 4,
      name: '学术用品'
    },
    daily: {
      id: 5,
      name: '衣橱衣服'
    },
    housing: {
      id: 6,
      name: '房屋转租'
    },
    travel: {
      id: 7,
      name: '交通用品'
    },
    makeup: {
      id: 8,
      name: '美妆护肤'
    },
    others: {
      id: 1,
      name: '其他宝贝'
    }
  };
}

export default {
  productIdAndName: _getProductTypeMapping(),
  getAllActiveProducts,
  getProductsByType,
  getUserId,
  getMyProduct,
  chooseImagePromise,
  postProducts
};