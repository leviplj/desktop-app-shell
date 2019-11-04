export default [
  {
    path: '/departments/',
    name: 'Department',
    component: require('@/views/DepartmentList').default,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/departments/add',
    name: 'Add Department',
    component: require('@/views/Department').default,
    meta: { 
      requiresAuth: true
    }
  },
  {
    path: '/departments/edit/:id',
    name: 'Edit Department',
    component: require('@/views/Department').default,
    meta: { 
      requiresAuth: true
    }
  },
]