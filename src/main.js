import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入字体图标
import'./assets/fonts/iconfont.css'
Vue.config.productionTip = false

import axios from 'axios'//导入包
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"//配置请求的根路径
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios//挂载到vue的原型对象上

new Vue({
  // 通过render函数将根组件渲染到了页面
  render: h => h(App),
  router
}).$mount('#app')
