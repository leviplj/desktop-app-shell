export default [
  {
    path: '/products/',
    name: 'Products',
    component: require('@/views/ProductList').default,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/products/add',
    name: 'Add Product',
    component: require('@/views/Product').default,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/products/edit/:id',
    name: 'Edit Product',
    component: require('@/views/Product').default,
    meta: { 
      requiresAuth: true
    }
  },
]