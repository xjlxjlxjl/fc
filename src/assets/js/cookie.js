class cookie {
  // 存cookie
  setCookie(name, value, times) {
    let date = new Date().getTime() + times * 1000;
    window.document.cookie = name + "=" + value + ";expires=" + date;
  }
  // 取cookie
  getCookie(name) {
    let cookies = window.document.cookie;
    let cookieArr = cookies.split(";");
    for (let item of cookieArr) {
      let arr = item.split("=");
      // 去除空格
      if (name == arr[0].replace(/(^\s*)|(\s*$)/g, "")) return arr[1];
    }
    return null;
  }
  //  删除 cookie
  removeCookie(name) {
    this.setCookie(name, "", "-1");
    // 通过建立 cookie 的时间设置，将时间设置提前一天，从而强行让 cookie 失效，最后达到 删除cookie 的目的
  }
}

const MyPlugin = {
  install: function(Vue, options) {
    const { setCookie, getCookie, removeCookie, trim } = new cookie();
    Vue.prototype.setCookie = setCookie;
    Vue.prototype.getCookie = getCookie;
    Vue.prototype.removeCookie = removeCookie;
  }
};
export default MyPlugin;
