export default [
  {
    path: '/products/',
    name: 'Products',
    component: require('@/views/ProductList').default
  },
  {
    path: '/products/add',
    name: 'Add Product',
    component: require('@/views/Product').default
  },
  {
    path: '/products/edit/:id',
    name: 'Edit Product',
    component: require('@/views/Product').default
  },
]