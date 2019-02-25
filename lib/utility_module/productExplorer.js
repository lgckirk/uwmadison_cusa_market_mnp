import Product from "../../models/Product";
import URL from "URL";
import type from "type";
import userID from "userID";
import wxp from "wxp";

/**
 * Query server and get all active products
 * @param int offset
 * @pageSize int pageSize
 * @return A promise that will be resolved with an array of Products model.
 */
function getAllActiveProducts(offset, pageSize) {
  let data = { "Action": "GetAllProducts" };
  if (offset!=undefined) data["StartId"] = offset;
  if (pageSize!=undefined) data["pageSize"] = pageSize;
  return wxp._requestPromise(URL._marketUrl, data)
          .then(function (res) {
            if (!res.Products||res.Products.length==0) return [];
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
  let data = {
      "Action": "GetProductsByType",
      "TypeId": typeId
  };
  if (offset) data["StartId"] = offset;
  if (pageSize) data["pageSize"] = pageSize;
  return wxp._requestPromise(URL._marketUrl, data)
  .then(function(res){
    return (res.Products.map((x) => new Product(x)));
  });
}

/** @review
 * Query Server for my product list 
 * @param offset: request offset
 * @param offset: request pageSize
 */
function getMyProduct(offset, pageSize, status = -1){
  return userID.getUserId(getApp().globalData) // Make sure UserId is retrieved
          .then((id)=>{
            let data = {
              "Action": "GetProductsByUserId",
              "UserId": id,
            };
            if (offset) data["StartId"] = offset;
            if (pageSize) data["ListLength"] = pageSize;
            data["Status"] = status;

            return wxp._requestPromise(URL._marketUrl, data);
          })
          .then((res)=> Array.isArray(res.Products)?
            (res.Products.map((x) => new Product(x))):[] );
}
function searchProducts(pat, offset){
  let data = {
    "Action": "SearchProducts",
    "Pattern": pat
  };
  if (offset != undefined && offset!=-1) data["Offset"] = offset;
  return wxp._requestPromise(URL._marketUrl, data)
            .then(function (res) {
              if (!res.Products||res.Products.length==0) return [];
              return (res.Products.map((x) => new Product(x)))
            });
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
  let postChain =  wxp._requestPromise(URL._marketUrl, data);

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
          return wxp._requestPromise(URL._marketUrl, imgConfig, data.ProductImages[promisePointer++]);
      });
  }
  return postChain;
}

/** @review
 * post multiple products and its images
 * @param data: Array of Product
 * @param Product.ProductName: String 
 * @param Product.ProductType: Number
 * @param Product.ProductOwner: Number (app.globalData.userInfo)
 * @param Product.ProductImages: Array[String] (OPTIONAL)
 * @promise resolve: Server response
 * @promise reject: Lack of Info
 */
function postProducts(data) {
  // Consistency with Server Side, type id++
  data.forEach(p=>p.ProductType++);
  let productLine = userID.getUserId();
  let postPointer = 0;
  for (var i=0;i<data.length;i++){
      productLine = productLine.then(function(res){
        return _postProduct(data[postPointer++]);
      });
  }
  return productLine;
}

function endList(ProductId){
  let data = {
    "Action": "EndListing",
    ProductId
  };
  return wxp._requestPromise(URL._marketUrl, data)
         .then(x=>console.log(x));
}

function republish(ProductId){
  let data = {
    "Action": "Republish",
    ProductId
  };
  return wxp._requestPromise(URL._marketUrl, data);
}

function getBanner(){
  let data = { "Action": "ShowAllBannerImage"};
  return wxp._requestPromise(URL._marketUrl, data)
  .then(banners=>{
    let bannerUrls = [];
    for (let i=0;i<banners.BannerImages.length;i++){
      let bannerId = banners.BannerImages[i].BannerImageId;
      bannerUrls.push(URL._bannerUrl.replace("[BannerId]", bannerId));
    }
    return bannerUrls;
  })
}

export default {
    getAllActiveProducts,
    getProductsByType,
    getMyProduct,
    searchProducts,
    _postProduct,
    postProducts,
    endList,
    republish,
    getBanner
};