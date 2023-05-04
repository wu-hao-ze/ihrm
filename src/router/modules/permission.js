import layout from '@/layout'
export default {
  path: '/permission',
  component: layout,
  name: 'permission',
  children: [{
    path: '',
    component: () => import('@/views/permission'),
    meta: {
      title: '权限',
      icon: 'lock'
    }
  }]
}
