import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 模板icons图标实现思路

// 全局注册svg-icon组件
Vue.component('svg-icon', SvgIcon)

// 下面三行代码的任务是把同级目录的svg目录下的.svg图片引入到项目中来
// require.context(路径, 是否扫描子目录, 正则匹配) 可以引入某个目录下的内容
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
// req是一个函数，req.keys()得到的是一个数组，里面的元素就是'xxx.svg'，然后map来循环数组把svg全都引入到目录中
// 之后在vue.config.js中loader插件打包svg，最后在页面中使用svg-icon组件，指定icon-class的名称
// svg-sprite-loader打包了所有svg到一个svg标签上，将svg名称作为symbol标签的id属性
// svg-icon使用iconClass属性引用了symbol的id
