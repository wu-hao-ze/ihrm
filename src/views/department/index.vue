<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 -->
      <el-tree :expand-on-click-node="false" default-expand-all :data="depts" :props="defaultProps">
        <!-- default-expand-all表示默认展开所有节点，expand-on-click-node控制是不是只点击箭头才能展开 -->
        <!-- 节点结构 -->
        <!-- 节点结构采用自定义，并使用插槽的形式，作用于插槽会提供两个参数一个是node，一个是data -->
        <!-- data就是上面传值为depts的data，在这里就是depts里面的数据 -->
        <!-- v-slot="{ node, data }" 只能作用在template，v-slot:名称可以简写为#名称 -->
        <template #default="{ data }">
          <!-- 下面使用element-ui文档中的layout布局中的组件，el-row和el-col，总共是24份，可以通过span选择几份 -->
          <!-- 通过 row 和 col 组件，并通过 col 组件的 span 属性我们就可以自由地组合布局 -->
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span
                :style="{ width: '50px', display: inline-block, margin: '10px'}"
              >{{ data.managerName }}</span>
              <!-- 下面的下拉菜单选项的command的属性值会传给上面@command事件的处理函数，通过事件参数对象$event接收 -->
              <el-dropdown trigger="click" @command="operateDept($event, data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹层组件 -->
    <!-- 注意这里子组件中关闭触发事件然后将showDialog的值修改成false，但是showDialog的值是父组件的，所以要子传父 -->
    <!-- 做法1：可以通过子组件$emit，父组件指定自定义事件来接收 -->
    <!-- 做法2：直接通过sync事件修饰符，子组件仍然$emit，然后传的值直接给到这里的showDialog -->
    <!-- 注意！！！！！！sync的子组件的自定义事件名为update:xxx的形式，所以这里子组件的自定义事件为update:showDialog -->
    <!-- 父传子通过自定义属性，这个自定义属性大驼峰命名法和短横线连接命名是互通的 -->
    <add-dept ref="addDept" :current-node-id="currentNodeId" :show-dialog.sync="showDialog" @updateDepartment="getDepartment" />
  </div>
</template>
<script>
import { getDepartment, delDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: { AddDept },
  data() {
    return {
      currentNodeId: null, // 存储当前点击的id
      showDialog: false, // 控制弹层的显示和隐藏
      depts: [], // 数据属性
      // depts: [{
      //   name: '一级 1',
      //   children: [{
      //     name: '二级 1-1',
      //     children: [{
      //       name: '三级 1-1-1'
      //     }]
      //   }]
      // }],
      // defaultProps(也就是props的值)要设置为和data属性的值(depts这个对象数组)中的属性和属性值的名称一样，比如下面
      defaultProps: {
        label: 'name', // 要显示的字段的名字
        children: 'children' // 读取子节点的字段名
      }
    }
  },
  created() {
    this.getDepartment() // 调用获取数据的接口
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment()
      this.depts = transListToTreeData(result, 1)
      console.log(this.depts)
    },
    // 操作部门方法
    operateDept(type, id) {
      if (type === 'add') {
        // 添加子部门
        this.showDialog = true // 显示弹层
        this.currentNodeId = id
      } else if (type === 'edit') {
        // 编辑部门
        this.showDialog = true
        this.currentNodeId = id // 记录id，要用它获取数据
        // 父组件调用子组件的方法来获取数据
        // 编辑比新增多的一点就是初始化子组件的formData数据，让它回显
        // 注意上面刚更新currentNodeId，下面就调用子组件的这个方法，而这个方法又用到了currentNodeId，所以还没来得及更新
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail() // this.$refs.addDept是子组件的this
        })
      } else {
        // 删除部门
        // 利用element中的messagebox弹框，调用$confirm方法即可打开消息提示，它模拟了系统的confirm
        // $confirm方法返回一个promise，如果确定删除则可以通过then来接收
        this.$confirm('您确定要删除该部门吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await delDepartment(id)
          // 提示消息
          this.$message.success('删除部门成功')
          this.getDepartment()
        })
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
