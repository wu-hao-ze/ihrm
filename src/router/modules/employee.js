import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  name: 'employee',
  children: [
    {
      path: '',
      component: () => import('@/views/employee'),
      meta: {
        title: '员工', // title是会显示在左侧和上侧导航的文本
        icon: 'people'
      }
    },
    {
      // 添加员工不带id，查看员工是要携带id的，所以要使用/:id?
      // ?代表可以有也可以没有
      path: '/employee/detail/:id?',
      component: () => import('@/views/employee/detail.vue'),
      // 要让左侧导航只显示一级菜单，让二级路由只有一个显示在左侧菜单，所以要用hidden
      hidden: true, // 表示隐藏在左侧菜单
      meta: {
        title: '员工详情'
      }
    }
  ]
}

