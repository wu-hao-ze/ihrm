// getters中的计算属性是为了更便捷的获取子模块的存放信息，要不然外面访问数据还得store.state.模块名.xxx
// 现在直接就可以store.getters.xxx
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userInfo.userId,
  avatar: state => state.user.userInfo.staffPhoto, // 头像
  name: state => state.user.userInfo.username, // 用户名称
  routes: state => state.user.routes,
  company: state => state.user.userInfo.company, // 公司名称
  // 两种写法都行
  departmentName(state) {
    return state.user.userInfo.departmentName // 部门名称
  }
}
export default getters
