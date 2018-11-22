// 存cookie
const setCookie = (name, value, times) => {
  let date = new Date();
  date.setTime(date.getTime() + times * 1000);
  document.cookie = name + "=" + value + ";expires=" + date;
};

// 取cookie
const getCookie = name => {
  let cookies = document.cookie;
  let cookieArr = cookies.split(";");
  for (let item of cookieArr) {
    arr = item.split("=");
    if (name == trim(arr[0])) return arr[1];
  }
  return false;
};

//  删除 cookie
const removeCookie = name => {
  setCookie(name, "", "-1");
  // 通过建立 cookie 的时间设置，将时间设置提前一天，从而强行让 cookie 失效，最后达到 删除cookie 的目的
};

// 去除空格
function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, "");
}

export default {
  setCookie,
  getCookie,
  removeCookie
};
