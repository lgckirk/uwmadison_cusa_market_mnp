import Product from "../models/Product";

// const marketUrl = "http://testcusa-env.afejb3cmmd.us-east-2.elasticbeanstalk.com/MarketExecute.php";
// const loginUrl = "http://testcusa-env.afejb3cmmd.us-east-2.elasticbeanstalk.com/LoginExecute.php"
const marketUrl = "https://madishare.com/MarketExecute.php";
const loginUrl = "https://madishare.com/LoginExecute.php";
let app = getApp();

/** @review
 * Local function to promisify wx request 
 * @param endpoint: url of the endpoint being requested
 * @param data: POST data field for the endpoint
 * @param filePath: path of the file attached to the form (OPTIONAL)
 * @promise resolve: the response data if request completes successfully,
 * @promise reject: if either ErrorCode is set or wx fail to send the request
 */
function requestPromise(endpoint, data, filePath){
  let hasFile = filePath!=undefined;
  let req = hasFile?wx.uploadFile:wx.request;
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
      config['name'] = "ProductImage";
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

/** @review
 * Promisified function for user login
 * Also can be used to check existence of globalData.userInfo
 * @param config (Optional): the globalData object used to automatically store the retrieved UserID 
 * @promise resolve: UserId (unique) from server
 * @promise reject:  Fail to generate wx code or fail to retrieve UserId from server
 */
function getUserId(globalData){ 
  return new Promise(function(resolve, reject){
    var app = getApp();
    // In case userId already exists
    if (app && app.globalData.userInfo) return resolve(app.globalData.userInfo);
    wx.login({
      success: function(res){
        if (!res.code) reject({"ErrorMessage": "Fail to Generate Login Code"});
        requestPromise(loginUrl, {"LoginCode": res.code})
        .then(function(data){
          app = getApp();
          if (globalData) globalData.userInfo = data.UserId;
          if (app) app.globalData.userInfo = data.UserId;
          return resolve(data.userId);
         })
      },
      fail: function(res){
        reject({'message': "Fail to Login"});
      }
    });
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
            return requestPromise(marketUrl, data);
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
function postProduct(data) {
  // Check validity
  if (!data.ProductName)
      throw { 'message': "Lack product name" };
  if (!data.ProductType)
      throw { 'message': "Lack product type" };
  data.ProductOwner = getApp().globalData.userInfo;
  // Post Product
  data["Action"] = "PostProduct";
  let postChain =  requestPromise(marketUrl, data);

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
          return requestPromise(marketUrl, imgConfig, data.ProductImages[promisePointer++]);
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
        return postProduct(data[postPointer++]);
      });
  }
  return productLine;
}

/** @review: 这个真的需要吗? 感觉好像微信自己集成了关于路由的功能了?
 * Return a function binded to the url specified by the argument.
 * When called, it does a page jump to the binded url.
 * @param String url Url
 * @param function (optional) callback Callback to invoke prior to page jump.
 */
function getPageJumpCallback(url, callback) {
  return function() {
    if (callback) {
      callback();
    }
    wx.navigateTo({ url })
  };
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
  return requestPromise(marketUrl, data)
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
  return requestPromise(marketUrl, data)
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
  getPageJumpCallback,
  getAllActiveProducts,
  getProductsByType,
  getUserId,
  getMyProduct,
  chooseImagePromise,
  postProducts
};