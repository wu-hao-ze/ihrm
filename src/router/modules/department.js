import layout from '@/layout'
export default {
  // 路由信息
  path: '/department',
  component: layout, // 一级路由
  name: 'department', // 这个是给路由对象绑定的属性，是为了后面筛选动态路由，在permission.js中的遍历动态路由数组中的item.name
  children: [{
    path: '', // 二级路由地址为空时 表示 /department 显示一级路由 + 二级路由
    component: () => import('@/views/department'),
    meta: {
      // 路由元信息 存储数据的
      // icon和title是会被模板读取的，显示到左侧树形结构中
      icon: 'tree', // 图标
      title: '组织' // 标题
    }
  }]
}
