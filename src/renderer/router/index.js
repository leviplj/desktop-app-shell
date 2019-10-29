import Vue from 'vue'
import Router from 'vue-router'

import ProductRouter from '@/router/product'
import DepartmentRouter from '@/router/department'

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
  ProductRouter,
  DepartmentRouter
)

export default new Router({
  routes
})
