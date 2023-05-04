import router from '@/router'
// 引入进度条的配置
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router'

/** *
 * 前置守卫，路由跳转之前执行
 * **/
// 白名单是指有几个页面不需要token也可以访问
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => { // next的跳转是不执行后置守卫的，next()是执行后置守卫的
  nprogress.start() // 进度条的开启
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 判断是不是认为在主页中更改url为登录，如果这种情况发生一定要禁止，因为这种情况没有删除token和个人信息
      next('/') // 跳转到主页
      nprogress.done() // 进度条的关闭
    } else {
      // 判断是否获取过个人信息
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // 用户信息中有roles，里面有一个menus数组，数组的元素就是可以访问的模块，比如menus:["department", "role"]
        // 最多就是8个权限模块，在动态路由中筛选roles.menus中有的模块，得到真正需要的动态路由
        const filterRoutes = asyncRoutes.filter(item => roles.menus.includes(item.name)) // 筛选后的路由
        console.log(roles.menus)
        store.commit('user/setRoutes', filterRoutes)
        // 路由实例对象有一个方法，就是为了添加路由信息router.addRoutes()
        // 把404挪到所有路由信息的最后，而不仅仅是静态路由最后
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // router添加动态路由之后，如果直接next()就会一刷新就空白了，这是router的一个已知缺陷
        // 为了解决这个问题，需要把路由再转发一下，也就是next(to.path)，目的是让路由拥有信息
        next(to.path)
      } else {
        next() // 放过
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login') // 跳转到登录页
      nprogress.done()
    }
  }
})

/** *
 * 后置守卫，路由跳转之后执行
 * **/
router.afterEach(() => {
  console.log('123')
  nprogress.done()
})
