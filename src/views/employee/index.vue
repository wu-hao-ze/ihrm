<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <!-- node-key每个树节点用来作为唯一标识的属性，整棵树应该是唯一的，id是depts中数据的id值 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <!-- 注意这里add一定要加''因为是字符串，并且是js表达 -->
          <el-button v-permission="'add'" size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog = true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template v-slot="{ row }">
              <el-button size="mini" type="text" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button size="mini" type="text" @click="btnRole(row.id)">角色</el-button>
              <!-- <el-popconfirm title="确认删除该行数据吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm> -->
              <el-button size="mini" type="text" style="margin-left:10px" @click="confirmDel(row.id)"> 删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total, prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
    <!-- excel导入组件 -->
    <!-- 这个.sync修饰符在import-excel组件内会有$emit('update:showExcelDialog', false) -->
    <!-- 两个配合才会使sync修饰符发挥作用，把false传到父组件index.vue中的showExcelDialog -->
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />

    <!-- 点击角色后的弹层组件 -->
    <el-dialog :visible.sync="showRoleDialog" title="分配角色">
      <!-- checkbox -->
      <el-checkbox-group v-model="roleIds">
        <!-- label与上面v-model中的roleIds数组相对应，如果label的值在roleIds中存在，则为选中状态，否则为不选中 -->
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="btnRoleOK">确定</el-button>
          <el-button size="mini" @click="showRoleDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { getEmployeeList, exportEmployee, delEmployee, getEnableRoleList, getEmployeeDetail, assignRole } from '@/api/employee'
import { transListToTreeData } from '@/utils'
import FileSaver from 'file-saver'
import ImportExcel from './components/import-excel.vue'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      depts: [], // 组织数据
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 存储查询参数
      queryParams: {
        departmentId: null, // 选中节点
        page: 1, // 当前页码
        pagesize: 5, // 一页多少条数据
        keyword: '' // 输入框的搜索关键字
      },
      list: [], // 存储员工列表数据
      total: 0, // 记录员工的总数
      showExcelDialog: false, // 控制excel的弹层显示和隐藏
      showRoleDialog: false, // 用来控制角色弹层的显示
      roleList: [], // 接收角色列表
      roleIds: [], // 用来双向绑定数据
      currentUserId: null // 记录角色按钮所在的员工的id
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 获取员工列表的方法
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    // 获取左侧树形结构的数据
    async getDepartment() {
      // 递归方法，将列表数据转化成树形数据
      this.depts = transListToTreeData(await getDepartment(), 1)
      // 设置选中节点
      this.queryParams.departmentId = this.depts[0].id
      // 树组件渲染是异步的，等到更新完毕才能选中
      this.$nextTick(() => {
        // setCurrentKey设置某个节点的当前选中状态，也就是高亮此节点，使用此方法必须设置node-key属性
        // 而且此方法是一次性的，在初始化数据时设置之后就会给这个树形组件绑定这个方法，会根据里面参数的变化来高亮不同的节点
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    // current-change是树形组件自带的当前选中节点变化时触发的事件，共两个参数，依次为：当前节点的数据，当前节点的Node对象
    selectNode(value) {
      this.queryParams.departmentId = value.id // value就是this.depts[i]
      this.queryParams.page = 1 // 因为切换部门，所以要展示第一页
      this.getEmployeeList()
    },
    // 切换页码
    changePage(newPage) {
      this.queryParams.page = newPage // 赋值新页码
      this.getEmployeeList() // 查询数据
    },
    // 输入值内容改变时触发
    changeValue() {
      // 利用防抖，在单位时间之内只执行最后一次
      // 给this的实例上赋值了一个timer的属性
      // 注意，直接在data中声明的数据是响应式数据，如果直接this.属性=xxx，是动态绑定，不是响应式的，但是也可以使用
      // 这里也不需要响应式，所以可以直接this.timer来赋值
      clearTimeout(this.timer) // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 800)
    },
    // 导出员工的excel
    async exportEmployee() {
      const result = await exportEmployee() // 导出所有的员工
      // result是响应的结果，是一个二进制文件流格式，它是blob类型
      // 使用一个npm包file-saver，可以直接将blob文件下载到本地
      // FileSaver.saveAs(blob对象, 文件名称)
      FileSaver.saveAs(result, '员工信息表.xlsx') // 下载文件
    },
    // 删除员工方法
    async confirmDel(id) {
      await this.$confirm('确定要删除该数据吗', { type: 'warning' })
      await delEmployee(id)
      if (this.list.length === 1 && this.queryParams.page > 1) this.queryParams.page--
      this.getEmployeeList()
      this.$message.success('删除员工成功')
    },
    // 点击角色按钮
    async btnRole(id) {
      this.roleList = await getEnableRoleList()
      this.currentUserId = id // 记录角色按钮所在的员工的id，因为后面确定取消要存取给对应的员工
      const { roleIds } = await getEmployeeDetail(id) // 这一步是回显该员工本身的角色
      this.roleIds = roleIds
      this.showRoleDialog = true // 等上面两个接口完事，再弹层
    },
    // 点击角色按钮之后点确定
    async btnRoleOK() {
      await assignRole({
        id: this.currentUserId,
        roleIds: this.roleIds
      })
      this.$message.success('分配用户角色成功')
      this.showRoleDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
