import Vue from 'vue'
import VueJsDialog from 'vuejs-dialog'

import router from './router'
import App from '@/App.vue'

import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(VueJsDialog)


Vue.prototype.products = Array(100).fill(1)
  .map((x, y) => {
    return {
      id: x+y, 
      description: `Product ${x+y}`, 
      price: (x+y)
    }
  })

global.$vm = new Vue({
  el: '#app',
  router,
  render(h) {
    return h(App)
  }
})