import axios from 'axios';
import elementUi from 'element-ui';
import qs from 'qs';

// axios 配置
axios.defaults.timeout = 60000;
// axios.defaults.baseURL = 'https://api.factoryun.com/';
// axios.defaults.baseURL = 'http://api.af.com/';
axios.defaults.baseURL = 'http://api.skyliu.cn/';
// http request 拦截器
axios.interceptors.request.use(
  config => {
    if(config.method == 'get')
      config.params = config.data;
    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    if(user){
      axios.defaults.headers.common['Accept'] = 'application/json';
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
      axios.defaults.headers.common['Company-Code'] =  user.slug;
    }
    return config;
  },
  error => {
    return Promises.reject(error);
  }
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.status == 200){
      if(response.data.status != 200){
        elementUi.Message({
          message: response.data.message,
          type: 'error'
        });
      }
      return response.data;
    }
  },
  error => {
    elementUi.Notification({ message: '网络错误' });
    return Promise.reject(error);
  }
);

export function get(url, data = new Object){
  let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      data: data,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization':  user ? 'Bearer ' + user.token : '',
        'Company-Code': user ? user.slug : ''
      }
    }).then( response => {
      resolve(response);
    }, err => {
      reject(err);
    })
  });
}

export function post(url, data = new Object){
  let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      data: data,
      transformRequest: [
        function(data){
          data = qs.stringify(data);
          return data;
        }
      ],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Authorization': user ? 'Bearer ' + user.token : '',
        'Company-Code': user ? user.slug : ''
      }
    }).then( response => {
      resolve(response);
    }, err => {
      reject(err);
    })
  });
}

export function upload(url, data = new Object){
  let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': user ? 'Bearer ' + user.token : '',
        'Company-Code': user ? user.slug : ''
      }
    }).then( response => {
      resolve(response);
    }, err => {
      reject(err);
    })
  });
}

export function patch(url, data = {}){
  return new Promise((resolve, reject) => {
    axios.patch( url, data).then( response => {
      resolve(response);
    }, err => {
      reject(err);
    })
  });
}

export function put(url, data = {}){
  return new Promise((resolve, reject) => {
    axios.put( url, data).then( response => {
      resolve(response);
    }, err => {
      reject(err);
    })
  });
}