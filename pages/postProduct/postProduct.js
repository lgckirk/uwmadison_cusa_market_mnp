import util from "../../lib/utility";
import moment from "../../lib/moment.js";
import Product from "../../models/Product";
let app = getApp();
Page({
  data: {
    array: util.getProductTypeArray(),
    products: [{
      'ProductType': 1
    }],
    scrollID: 'id0',
    enableScroll: false,
    focusField: -1,
    onUploading: false
  },
  onShow: function(){
    util.getMyContact()
    .then(contact=> {!contact ? wx.switchTab({url:"/pages/myProduct/myProduct"}): null})
  },
  nextProduct: function(){
    let currID = parseInt(this.data.scrollID.substring(2));
    if (this.data.products[currID].ProductImages.length == 0)
    {
      util.showToast("需添加一张照片");
      return;
    }
    if (currID == this.data.products.length - 1) {
      let buffer = this.data.products;
      buffer.push({'ProductType': 1});
      this.setData({'products': buffer});
    }
    currID++;
    this.setData({'enableScroll': true});
    this.setData({'scrollID': 'id' + currID});
    this.setData({'enableScroll': false});
  },
  prevProduct: function(){
    let currID = parseInt(this.data.scrollID.substring(2));
    if (currID == 0) return; 
    currID--;
    this.setData({'enableScroll': true});
    this.setData({'scrollID': 'id' + currID});
    this.setData({'enableScroll': false});
  },
  infoUpdate: function(e){
    const fieldMap = {
      'n': 'ProductName',
      't': 'ProductType',
      'd': "ProductDescription"
    };
    // Extract Information
    let value = e.detail.value;
    let flag = e.target.id[0];
    let ID = parseInt(e.target.id.substring(1));
    // Construct datafield name
    let field = 'products[' + ID + '].' + fieldMap[flag];
    let config = {};
    config[field] = value;
    this.setData(config);
  },
  validate: function(){
    if (this.data.onUploading) return false;
    let buffer = this.data.products;
    let ret = true;
    let hasInput = (input,field) => input.hasOwnProperty(field) 
      && input[field].length>0;
    for (var i=0;i<buffer.length;i++){
      // Check if input is complete
      buffer[i].complete = hasInput(buffer[i], 'ProductName');
      // Check if completely empty
      buffer[i].exist = buffer[i].complete 
      || hasInput(buffer[i], 'ProductDescription') || hasInput(buffer[i], 'ProductImages');
      ret = ret && (!buffer[i].exist || buffer[i].complete);
    }
    let writeBuffer = [];
    let jumpId = null;
    for (var i=0;i<buffer.length;i++){
      // filter out the empty card
      if (!buffer[i].exist) continue; 
      if (!buffer[i].complete) jumpId = writeBuffer.length;
      // delete redundant field
      delete buffer[i].exist;
      delete buffer[i].complete;
      writeBuffer.push(buffer[i]);
    }

    if (writeBuffer.length == 0)
      writeBuffer.push({'ProductType': 1});
    this.setData({'products': writeBuffer});

    // jump to the incomplete card
    if (jumpId!=null){
      this.setData({'scrollID': 'id' + jumpId});
      util.showToast("名字为必填信息!", "none");
    }else{ // no incomplete card, back to the first card
      this.setData({'scrollID': 'id' + 0});
    }
    return ret;
  },
  postProducts: function(){
    if (!this.validate()) return;
    this.setData({'onUploading': true});
    // default message
    let title = "成功", icon = "success";
    util.showLoading()
    .then(_=>util.postProducts(this.data.products)) 
    // Clear out the posted product
    .then(_=>this.setData({"products": [{'ProductType':1}],}))
    // Change to error message if error occurs
    .catch(err=>{
      console.log("Error: ");
      console.log(err);
      title = "失败", icon = "none";
    })
    .then(_=>this.setData({"onUploading": false}))
    .then(util.hideLoading)
    .then(_=>util.showToast(title, icon))
  },
  selectImage: function(){
    let that = this;
    util.chooseImagePromise()
    .then(function(imgPaths){
        console.log("Successfully Retrieve Images");
        let currID = parseInt(that.data.scrollID.substring(2));
        let buffer = [];
        if (that.data.products[currID].ProductImages!=undefined)
        buffer = buffer.concat(that.data.products[currID].ProductImages);
        console.log(buffer);
        for (var i=0;i<imgPaths.length;i++)
            buffer.push(imgPaths[i]);
        let config = {};
        config["products["+ currID +"].ProductImages"] = buffer;
        that.setData(config);
    })
    .catch(function(err){
        console.log("Error while retrieving");
        console.log(err);
    })
  }
})