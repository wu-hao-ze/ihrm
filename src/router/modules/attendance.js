import layout from '@/layout'
export default {
  path: '/attendance',
  component: layout,
  name: 'attendance',
  children: [{
    path: '',
    component: () => import('@/views/attendance'),
    meta: {
      title: '考勤',
      icon: 'excel'
    }
  }]
}
