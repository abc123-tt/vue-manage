import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
// import './assets/css/global.css'

// 导入fontawesome
import 'font-awesome/css/font-awesome.min.css'

import './plugins/elementUI'
import './assets/css/global.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器所需css表
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//引入vue-table-with-tree-grid
import ZKTable from 'vue-table-with-tree-grid'

//安装vue-table-with-tree-grid
Vue.use(ZKTable)
const dayjs = require("dayjs");
Vue.prototype.dayjs = dayjs

// 将文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor);


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
