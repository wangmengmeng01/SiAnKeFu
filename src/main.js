import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import localeCN from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import toolFunction from './utils/tool'
import '@/icons'
import '@/permission' // permission control

import TreeTable from 'tree-table-vue'
import Clipboard from 'v-clipboard'
Vue.use(toolFunction)// 全局注册工具函数
Vue.use(TreeTable)
Vue.use(Clipboard)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { localeCN })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
