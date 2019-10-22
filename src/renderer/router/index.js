import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: require('@/components/pages/MainPage').default
    },
    {
      path: '/products/',
      name: 'Products',
      component: require('@/components/pages/ProductList').default
    },
    {
      path: '/products/add',
      name: 'Add Product',
      component: require('@/components/pages/Product').default
    },
    {
      path: '/products/edit/:id',
      name: 'Edit Product',
      component: require('@/components/pages/Product').default
    },    
    {
      path: '*',
      redirect: '/?404'
    }
  ]
})
