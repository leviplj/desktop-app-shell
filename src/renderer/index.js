import Vue from 'vue'
import VueJsDialog from 'vuejs-dialog'

import router from './router'
import App from '@/App.vue'

import 'vuejs-dialog/dist/vuejs-dialog.min.css';

Vue.use(VueJsDialog)

Vue.prototype.products = [{
  id: 1,
  description: 'Product 1',
  price: 1.10
},{
  id: 2,
  description: 'Product 2',
  price: 2.10
},{
  id: 3,
  description: 'Product 3',
  price: 3.10
},{
  id: 4,
  description: 'Product 4',
  price: 4.10
},{
  id: 5,
  description: 'Product 5',
  price: 5.10
},{
  id: 6,
  description: 'Product 6',
  price: 6.10
},{
  id: 7,
  description: 'Product 7',
  price: 7.10
},]

global.$vm = new Vue({
  el: '#app',
  router,
  render(h) {
    return h(App)
  }
})