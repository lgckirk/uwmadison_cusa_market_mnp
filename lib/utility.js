
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

export default {
  getPageJumpCallback
};