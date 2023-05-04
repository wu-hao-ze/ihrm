// 底层框架：本项目是基于vue-element-admin二次开发
// 业务模块应用RBAC权限，登录，主页，组织，角色，员工，权限
// 解决方案：弹层/行内/跳转编辑，组件封装，Vuex，树形递归，左树右表，cos上传，echarts图表渲染，正向/反向代理跨域，RBAC动态路由，前端项目CRUD(增删改查)，表单验证自定义校验，自定义指令解决权限，excel导入导出，nginx部署等

// vue-element-admin文档地址：	https://panjiachen.gitee.io/vue-element-admin-site/zh/
// vue-element-admin演示地址：	https://panjiachen.github.io/vue-element-admin/
// 项目演示地址：	https://heimahr.itheima.net

// 在本地git bash here中拉取模版代码：git clone https://github.com/PanJiaChen/vue-admin-template.git ihrm
// 最后的ihrm是自定义名称，拉取结束会自动在当前位置创建对应名称的文件夹
// 然后在package.json文件中修改core-js的版本号，改为3.25.5再执行命令yarn安装依赖
// eslint工作区启动，根目录打开项目，可以把package.json文件中的命令修改，比如dev改成serve
// 别忘了vue.config.js中publicPath改成相对路径

// components文件夹存放全局公用组件
// icons文件夹存放项目所有svg icons
// 使用模板中的icon图标：src/icons/svg目录下的图标都可以使用，图标文件名直接设置为svg-icon组件的iconClass属性
// <svg-icon icon-class="eye-open" />

// layout存放布局组件，也就是主页界面的左边栏sidebar，上边栏navbar，然后二级路由在它的右侧主体部分app-main
// settings.js导出网站基础配置，包括：网站标题、固定header、显示logo

// vuex中针对user模块重写，其余复用，app控制左侧导航的收缩，settings控制的是settings.js中的固定header和logo

// 登录功能的流程：登录表单校验，登录提交调用vuex的action函数调用登录接口，返回token，存储token并本地存储，跳转首页
// 登录接口需要api请求，request模块封装axios，利用vue-cli代理跨域

// vue-cli代理跨域是正向代理，是node代理，并且！！！！！！！只限于开发环境下使用
// 如果后端没有cors跨域，那么代理解决方案就是向vue-cli代理发请求，这个代理服务是一个node环境，这里面会配置path地址和对应的服务器
// 前端服务所处的url和代理服务是同一个，所以这个过程同源，然后node环境下的代理服务器向对应的服务器发请求
// 同源策略只存在浏览器中，这个过程不在浏览器，所以可以发请求
// 在vue.config.js中的devServer节点下新增proxy属性，具体的去vue.config.js查看
// 记住：改完配置文件，一定要重启服务器！！！！！重新yarn serve

// 开发环境：yarn serve 之后开启本地服务
// 生产环境：yarn build 打包文件，之后部署到服务器上
// .env.development中设置开发环境变量，把VUE_APP_BASE_API设置为'/api'    默认 NODE_ENV 值为 development
// .env.production中设置生产环境变量，VUE_APP_BASE_API为'/prod-api'     默认 NODE_ENV 值为 production
// 使用process.env.属性的方式获取变量的名称，比如process.env.NODE_ENV就可以获取到development或者production
// process.env.VUE_APP_BASE_API就可以获取到'/api'或者'/prod-api'

// axios请求基地址分为开发环境下和生产环境下两种，一个是api(vue-cli代理解决跨域)，一个是prod-api(上线处理跨域)
// 环境变量中除了NODE_ENV之外，所有的其他变量必须以VUE_APP_开头
// 在request.js中baseURL: process.env.VUE_APP_BASE_API,        实际上就是'/api'或者'/prod-api' 根据环境自行选择

// 主页权限验证在permission.js中，通过路由导航守卫来控制
// 需要获取用户信息，用户信息和token都要在vuex中存储
// 用户信息会用来显示用户名头像等，并渲染到页面结构中，在navbar中

// 修改密码的环节在layout中的navbar中
// 修改密码的实现：弹出dialog，密码表单校验，调用接口，重置表单，关闭弹层

// sidebar的实现过程(了解)：在sidebar组件中通过vuex的getters导入路由信息，并在页面结构中遍历路由信息
// 使用sidebar-item组件，可以看到其中传递了路由信息的meta信息，解析其中的标题和icon，使用item组件
// item组件中利用svg-icon组件来渲染图标，并且渲染标题

// 项目所需组件和路由是对应的
// department组织架构，role角色，employee员工，permission权限管理，attendance考勤，approval审批，salary工资，social社保

// 组织架构中利用el-tree组件来表示树形结构，利用作用域插槽接收数据，自定义节点结构通过element-ui的layout组件来实现
// 然后封装组织架构的api，初始化数据时调用，获取的数据中pid和id是对应的，关系为：如果x的pid和y的id相同，那么x是y的下级
// 封装递归函数根据关系把数据转化为树形层级结构，具体的在utils下的index.js，pid是父级部门的id
// 注册添加子部门事件，封装弹层组件，完成父子之间的通讯传值，弹层组件实现表单结构，表单校验，业务校验
// 业务校验是指部门名称和已有部门不能重复，部门编码也是，利用some方法
// 部门负责人通过el-select下拉菜单完成，封装api，初始化调用负责人数据
// 编辑部门通过调用子组件方法，来完成formData的回显，删除部门利用$confirm

// 角色管理中添加角色用dialog弹层，编辑角色利用行内编辑，通过新增isEdit和editRow来创建编辑的独立的数据，插槽条件渲染表单
// 动态添加的属性不具备响应式，所以这里要用到vue的$set，用于向响应式对象中添加一个属性，并确保这个新属性同样是响应式的，触发视图更新
// this.$set(目标对象, 属性名称, 初始值)等价于Vue.set(目标对象, 属性名称, 初始值)

// 员工管理中员工模糊搜索利用防抖，定时器的清除和设置来实现
// 员工导出excel中，导出员工接口返回的是二进制流，axios配置responseType为blob接收二进制流文件为Blob格式
// 安装file-saver包，实现下载Blob文件yarn add file-saver，然后调用方法来下载文件

// 权限应用：员工拥有角色(给员工分配角色)，角色拥有权限(给角色分配权限)，权限是访问权和操作权
// 权限应用：拆分静态路由和动态路由
// 静态路由：所有人都可以访问，比如首页/登录/404，路由固定
// 动态路由：有权限的人才可以访问，比如组织/角色/员工/权限/...，路由不固定
// 不同身份用户登录，获取对应权限，根据权限筛选用户拥有哪些路由，将动态路由添加到当前路由
// 因为默认给路由实例对象绑定的是静态路由，所以要按需给路由里加动态路由，这个过程在permission.js路由导航守卫中处理
// 根据权限筛选的路由菜单没显示，是因为动态添加的路由不具备响应式，所以要使用Vuex共享路由信息，直接给到要使用的组件就达到了响应式
// vuex中声明state和mutation，使用getters开放state属性，permission.js中筛选路由后提交mutations
// 最后左侧菜单引用getters，Layout/components/Sidebar/index.vue

// 退出登录要重置路由！！！！直接用路由的index.js中的resetRouter方法

// 权限应用-功能权限-按钮权限标识，在这里控制员工管理中的添加员工的按钮的使用
// 通过在权限管理中对员工管理添加一个权限，用来控制添加员工的按钮可否使用
// 在权限管理中type值为1的是访问权限，也就是根元素都是访问权限，而在它们之下添加的权限type值都为2，都是功能权限
// 然后给员工分配角色，给角色分配功能权限，然后用户资料中就会有对应的功能权限点，在userInfo中的roles中的points数组里
// 比如添加一个功能权限标识为add，那么points数组为["add"]，管理员账户不论分配不分配，都拥有所有的权限
// 封装自定义指令v-permission作用在按钮上，判断vuex中的points是否有对应标识
// 注意，在权限管理中添加的功能权限的标识，一定要和v-permission指令的值一致对应，才能生效

// 首页安装滚动数字插件vue-count-to，将span换成count-to组件

// hash模式带#，#后面的地址变化不会引起页面的刷新
// history模式没有#，地址变化会引起页面刷新，更符合页面地址的规范(开发环境不刷新是因为webpack配置)
// history模式需要有服务端的支持

// 项目开发完要打包上线，需要关注打包的体积多大，怎么优化，通过npm run preview -- --report进行打包分析(这个命令好像不太好使)
// 可以把mock注释掉，并没有使用，它是模拟数据，这样减少打包体积
// 还可以发现vue/element/cos体积比较大，可以在打包时排除，通过cdn外链引入，减小打包体积
// 在vue.config.js中configureWebpack节点中externals节点指定排除的包，然后在index.html中cdn外链引入
// <link href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.13/theme-chalk/index.min.css" rel="stylesheet">
// <script src="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.13/index.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js" ></script>
// <script src="https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js"></script>

// 使用脚手架命令打包之后生成的文件，不再支持webpack，不再有脚手架，放到服务器上托管nginx/docker等，公众通过地址访问
// 访问时如果是手动访问，则自己操作，把自己电脑当成服务器
// 访问时如果是自动访问，则要部署到阿里云/腾讯云等服务器上
// yarn build之后得到的dist就是要放到服务器上的
// 点击安装包下的nginx.exe，一闪而过代表启动成功，然后把dist代码放到html文件夹下，nginx默认的访问端口为80
// nginx可能不太好使，所以大致看看就可以了，不用深究，url地址为：http://localhost:80
// windows下停止服务，在nginx.exe所在目录运行：./nginx -s stop	#停止命令
// nginx解决history的页面刷新就404的问题：让nginx统一返回index.html
// 在nginx.conf文件中修改
// location / {
//   try_files $uri $uri/ /index.html;
// }
// windows下重启服务：./nginx -s reload	#重启
// nginx解决生产环境跨域问题：修改nginx.conf文件，新加
// location /prod_api {
//   proxy_pass https://heima-t.itheima.net;
// }
