import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// mock是没有请求时可以模拟一些数据，因为没有使用mock，所以可以减少打包体积，注释掉mock
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(ElementUI)

Vue.config.productionTip = false

// 封装自定义指令，用来控制对员工管理的添加按钮的功能权限
Vue.directive('permission', {
  // inserted会在指令作用的元素插入到页面完成以后触发
  inserted(el, binding) {
    // el是指令作用的元素的dom对象，binding是v-permission=""指令中的信息，binding.value就是这个里面的值

    // 加入?可选链操作符，防止因为没有用户信息或者没有roles而直接报错，注意如果是多个.的这种写法，尽量加一下可选链操作符防止报错
    const points = store.state.user.userInfo?.roles?.points || [] // 当前用户信息的操作权
    if (!points.includes(binding.value)) {
      // 不存在就要删除或者禁用
      el.remove() // 删除元素
      // el.disabled = true // 禁用元素
    }
  }

})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
