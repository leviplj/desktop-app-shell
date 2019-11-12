import Vue from 'vue'
import Router from 'vue-router'

import ProductRouter from '@/router/product'
import DepartmentRouter from '@/router/department'
import Register from '@/router/register'
import User from '@/router/user'

Vue.use(Router)

let routes = Array.prototype.concat(
  [
    {
      path: '/',
      name: 'Main',
      component: require('@/views/Main').default,
      meta: { 
        requiresAuth: true
      }
    },    
    {
      path: '*',
      redirect: '/?404'
    }
  ],
  ProductRouter,
  DepartmentRouter,
  Register,
  User,
)

let router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('jwt') == null) {
          next({
              path: '/login',
              params: { nextUrl: to.fullPath }
          })
      } else {
          let user = JSON.parse(localStorage.getItem('user'))
          if(to.matched.some(record => record.meta.is_admin)) {
              if(user.is_admin == 1){
                  next()
              }
              else{
                  next({ name: 'Main'})
              }
          }else {
              next()
          }
      }
  } else if(to.matched.some(record => record.meta.guest)) {
      if(localStorage.getItem('jwt') == null){
          next()
      }
      else{
          next({ name: 'Main'})
      }
  }else {
      next() 
  }
})

export default router