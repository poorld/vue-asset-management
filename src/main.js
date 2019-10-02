import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
//element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import router from './model/router'

/* import qs from 'qs'

Vue.prototype.$qs = qs */
Vue.prototype.$header = {
  "Content-Type": "application/json"
}

Vue.use(VueResource)

Vue.use(ElementUI)







new Vue({
  el: '#app',
  render: h => h(App),
  router
})
