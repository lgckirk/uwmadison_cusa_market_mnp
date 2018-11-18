import Product from "../models/Product";

// NOTE: variables and functions whose name starts with "_" are private and not to be exported

const _marketUrl = "http://testcusa-env.afejb3cmmd.us-east-2.elasticbeanstalk.com/MarketExecute.php";

/**
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
  // query params
  const data = {
    "Action": "GetAllProducts"
  };
  if (offset) {
    data["StartId"] = offset;
  }
  if (pageSize) {
    data["pageSize"] = pageSize;
  }

  const promise = new Promise((resolve, reject) => {
    wx.request({
      url: _marketUrl,
      data,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      dataType: "json",
      success: (res) => {
        // verify everything went well on the server side
        res = res.data;
        if (res.ErrorCode != 1) {
          fail({
            ErrorCode: res.ErrorCode,
            ErrorMessage: res.ErrorMessage
          });
        } else {
          resolve(res.Products.map((x) => new Product(x)));
        }
      },
      fail: (res) => reject("WX request failed")
    });
  });

  return promise;
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

  return new Promise((resolve, reject) => {
    // query params
    const data = {
      "Action": "GetProductsByType",
      "TypeId": typeId
    };
    if (offset) {
      data["StartId"] = offset;
    }
    if (pageSize) {
      data["pageSize"] = pageSize;
    }

    // query server
    wx.request({
      url: _marketUrl,
      data,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded",
      },
      dataType: "json",
      success: (res) => {
        // verify everything went well on the server side
        res = res.data;
        if (res.ErrorCode != 1) {
          fail({
            ErrorCode: res.ErrorCode,
            ErrorMessage: res.ErrorMessage
          });
        } else {
          resolve(res.Products.map((x) => new Product(x)));
        }
      },
      fail: (res) => reject("WX request failed")
    });
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
  getProductsByType
};