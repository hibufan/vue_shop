import Vue from 'vue'
// 按需加载element-ui
import { Button, Form, FormItem, Input, Message } from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 把弹框组件Message需要单独挂载到Vue原型对象上
Vue.prototype.$message = Message

