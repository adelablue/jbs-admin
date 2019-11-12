import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import store from './store'
import {getPath} from './api/common'
import util from  './api/util'
import Cookies from 'js-cookie'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)
Vue.use(ElementUI, { size: 'small' });
Vue.use(util)
Vue.use(Cookies)
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转

axios.interceptors.response.use((response) => {
  if (response.data.code === 1006) {
    window.location.href = getPath() + '#/'
  }
  return response
}, (error) => {
  console.log(error)
})
//自动给同一个vue项目的所有请求添加请求头
axios.interceptors.request.use(function (config) {
  let token = sessionStorage.getItem('token');
	if (token) {
		config.headers['Authorization'] = "Bearer " + JSON.parse(token);
	}
	return config;
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.requireAuth)) {
    if (sessionStorage.getItem('loginStatus')) {
      next()
    } else {
      next({path: '/', query: {referrer: to.fullPath}})
    }
  } else {
    next()
  }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');