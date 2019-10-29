export default [
  {
    path: '/departments/',
    name: 'Department',
    component: require('@/views/DepartmentList').default
  },
  {
    path: '/departments/add',
    name: 'Add Department',
    component: require('@/views/Department').default
  },
  {
    path: '/departments/edit/:id',
    name: 'Edit Department',
    component: require('@/views/Department').default
  },
]