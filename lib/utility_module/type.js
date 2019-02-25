function getProductTypeArray() {
  return ["其他宝贝", "日用家具", "电子产品", "学术用品", "衣橱衣服", "房屋转租", "交通用品", "美妆护肤"];
}
function getProductTypeMapping() {
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

export default  {
  getProductTypeArray,
  getProductTypeMapping
};