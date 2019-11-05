export default [
  {
    path: '/users/',
    name: 'User',
    component: require('@/views/UserList').default,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/users/add',
    name: 'Add User',
    component: require('@/views/User').default,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/users/edit/:id',
    name: 'Edit User',
    component: require('@/views/User').default,
    meta: { 
      requiresAuth: true
    }
  },
]