import layout from '@/layout'
export default {
  path: '/approval',
  component: layout,
  name: 'approval',
  children: [{
    path: '',
    component: () => import('@/views/approval'),
    meta: {
      title: '审批',
      icon: 'tree-table'
    }
  }]
}
