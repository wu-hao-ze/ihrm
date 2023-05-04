import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: '/api',
  // 基地址，这里的/api代表启动的端口加api，也就是http://localhost:9528/api
  // 这里之所以设置本地，是因为proxy代理会替换并发送目标服务器，所以不要在这里直接设置https://heimahr.itheima.net 因为跨域
  timeout: 10000 // 单位是ms
})

// 请求拦截器
service.interceptors.request.use((config) => {
  // 注入token
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, (error) => {
  // 因为axios的结果是promise，所以失败直接执行reject
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 判断是不是Blob数据
    if (response.data instanceof Blob) return response.data // 返回了Blob对象
    // 去掉axios的外面一层包装
    const { data, message, success } = response.data // 默认json格式
    if (success) {
      return data
    } else {
      Message({ type: 'error', message })
      return Promise.reject(new Error(message))
    }
  },
  // 错误处理
  async(error) => {
    if (error.response.status === 401) {
      Message({ type: 'warning', message: 'token超时了' })
      // 说明token超时了
      await store.dispatch('user/logout') // 调用action退出登录
      // 主动跳到登录页
      router.push('/login')
      return Promise.reject(error)
    }
    Message({ type: 'error', message: error.message })
    return Promise.reject(error)
  }
)
export default service
