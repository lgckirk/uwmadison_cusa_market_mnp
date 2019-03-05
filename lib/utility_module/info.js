
function showToast(title = "成功" , icon = "success", duration = 2000){
  return new Promise((resolve, reject)=>{
    wx.showToast({
      title,
      icon,
      duration,
      success: data=>resolve(data),
      fail: err=>reject(err)
    });    
  });
}

function showLoading(title="等待加载"){
  // console.log("show: " + showLoading.counter);
  if (showLoading.counter == undefined) showLoading.counter = 1;
  else showLoading.counter++;
  return new Promise((resolve, reject)=>{
    wx.showLoading({
      title,
      "success": ()=>resolve()
    });
  });
}

function hideLoading(){
  // console.log("hide:" + showLoading.counter);
  let blank = new Promise(res=>res());
  showLoading.counter--;
  if (showLoading.counter>0) return blank;
  return new Promise((resolve, reject)=>{
    wx.hideLoading({"success": ()=>resolve()})
  });
}

export default {
  showToast,
  showLoading,
  hideLoading
};