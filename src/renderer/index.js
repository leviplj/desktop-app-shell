import Vue from 'vue'
import VueJsDialog from 'vuejs-dialog'

import router from './router'
import App from '@/App.vue'

import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(VueJsDialog)

global.$vm = new Vue({
  el: '#app',
  router,
  render(h) {
    return h(App)
  }
})