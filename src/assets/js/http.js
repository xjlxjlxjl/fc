import axios from "axios";
import elementUi from "element-ui";
import qs from "qs";

// axios 配置
axios.defaults.timeout = 60000;
// axios.defaults.baseURL = "http://api.app.com/";
axios.defaults.baseURL = "http://api.skyliu.cn/";
// axios.defaults.baseURL = "https://api.factoryun.com/";
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if (config.method == "get") config.params = config.data;
    let user = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null;
    if (user) {
      axios.defaults.headers.common["Accept"] = "application/json";
      axios.defaults.headers.common["Authorization"] = "Bearer " + user.token;
      axios.defaults.headers.common["Company-Code"] = user.slug;
    }
    return config;
  },
  error => {
    return Promises.reject(error);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.status == 200) {
      if (response.data.status != 200) {
        elementUi.Message({
          message: response.data.message,
          type: "error"
        });
      }
      return response.data;
    }
  },
  error => {
    switch (error.request.status) {
      case 401:
        elementUi.Notification({ message: "令牌失效" });
        localStorage.clear();
        setTimeout(() => (window.location.href = "/login.html#/login"), 1500);
        break;
      case 404:
        elementUi.Notification({ message: "资源不见啦，请联系管理员" });
        break;
      case 500:
        elementUi.Notification({ message: "服务器内部错误，请联系管理员" });
        break;
      default:
        elementUi.Notification({ message: "网络错误，请检查网络连接" });
        break;
    }
    return Promise.reject(error);
  }
);

export function get(url, data = new Object()) {
  let user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : { token: "", slig: "" };
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: url,
      data: data,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer " + user.token,
        "Company-Code": user.slug || ""
      }
    }).then(response => resolve(response), err => reject(err));
  });
}

export function post(url, data = new Object()) {
  let user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : { token: "", slig: "" };
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: url,
      data: data,
      transformRequest: [
        function(data) {
          data = qs.stringify(data);
          return data;
        }
      ],
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        Authorization: "Bearer " + user.token,
        "Company-Code": user.slug || ""
      }
    }).then(response => resolve(response), err => reject(err));
  });
}

export function upload(url, data = new Object()) {
  let user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : { token: "", slig: "" };
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: url,
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + user.token,
        "Company-Code": user.slug || ""
      }
    }).then(response => resolve(response), err => reject(err));
  });
}

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .patch(url, data)
      .then(response => resolve(response), err => reject(err));
  });
}

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, data)
      .then(response => resolve(response), err => reject(err));
  });
}
