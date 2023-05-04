import layout from '@/layout'
export default {
  path: '/social',
  component: layout,
  name: 'social',
  children: [{
    path: '',
    component: () => import('@/views/social'),
    meta: {
      title: '社保',
      icon: 'table'
    }
  }]
}
