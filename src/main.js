// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
// 引入 AT-UI 组件、AT-UI-Style
import AtComponents from 'at-ui';
import 'at-ui-style/src/index.scss';
import "@/assets/iconFont/iconfont.css";
import App from './App';
import router from './router';
import CONFIG from './utils/config';

// 设置Axios DefualtUrl
axios.defaults.baseURL = CONFIG.BASE_URL;
// 通过修改原型链使用 axios -> this.$http
// Vue.prototype.$http = axios;
Vue.config.productionTip = false;
/**
 * AT-UI 提供全局实例方法 组件库：https://at-ui.github.io/at-ui/#/zh
 * this.$Message.success(config) 全局提示
 * this.$Notify(config)  右上角提示
 * this.$Loading.start  顶部加载条···
 * this.$Modal.alert(config)  模态提示框
 * 配置文档：https://github.com/AT-UI/at-ui/tree/master/docs/markdown/zh
 */
// 使用 AT-UI 组件
Vue.use(AtComponents);

axios.interceptors.request.use((config) => {
  if (localStorage.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config['headers']['common']['token'] = localStorage.token;
  }
  return config;
}, (err) => {
  // 请求失败的处理
  this.$Message.error(err.message);
  return Promise.reject(err);
});
var _ = this;
axios.interceptors.response.use(response => {
  if(response.data&&response.data.errorCode=='401'){
    localStorage.token = '';
    location.reload(true);
  }
  return response
}, (err) => {
  // TODO
  // this.$Message.error(err.message);
  return Promise.reject(err);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
});
