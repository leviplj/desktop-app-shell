import Vue from 'vue'
import Router from 'vue-router'

import ProductRouter from '@/router/product'

Vue.use(Router)

let routes = Array.prototype.concat(
  [
    {
      path: '/',
      name: 'Main',
      component: require('@/views/Main').default
    },    
    {
      path: '*',
      redirect: '/?404'
    }
  ],
  ProductRouter
)

export default new Router({
  routes
})
