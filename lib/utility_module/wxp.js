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
  console.log("Executed");
  let config = {
    "count": 9 // at-most 9 images at onces selected
  }
  return new Promise(function(resolve, reject){
    config.success = res => {resolve(res.tempFilePaths)};
    config.fail = err => {
      console.log(err);
      if (err.errMsg.indexOf("cancel")>=0) resolve(null);
      else reject(err);
    };
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
      "fail": function(err){
        reject({"ErrorMessage": "Fail to Generate Login Code"});

      }
    })
  })
}

function _getImageInfo(src){
  return new Promise((res, rej)=>{ 
    wx.getImageInfo({
      "src": src,
      "success": dim=>res(dim),
      "fail": err=>rej(err)
    });
  });
}

function getImageInfo(images){
  if (getApp().globalData.enableImage) return _getImageInfo_(images);
  else return _getImageInfo_test_(images);
}

function _getImageInfo_(images){
  let imageInfo = [];
  let infoRequest = new Promise(res=>res());
  let pointer = 0;
  for (var i=0;i<images.length;i++){
    // Query Info
    infoRequest = infoRequest.then(_=>_getImageInfo(images[pointer++]));
    // push dims into array
    infoRequest = infoRequest
                  .then(data=>imageInfo.push(data))
                  .catch(err=>imageInfo.push(null));
  }

  return infoRequest.then(_=>imageInfo);
}
// testing purpose
function _getImageInfo_test_(images){
  let imageInfo = images.map(i=>null);
  return new Promise(res=>res(imageInfo));
}

export default {
  _requestPromise,
  _loginCodePromise,
  _getImageInfo,
  getImageInfo,
  chooseImagePromise
};