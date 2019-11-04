export default [
  {
    path: '/login/',
    name: 'Login',
    component: require('@/views/Login').default,
    meta: { 
        guest: true
    }
  },
]