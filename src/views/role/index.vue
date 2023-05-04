<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <!-- 放置列，prop属性的值对应上面data数据的值也就是list对象数组中的对象的键名 -->
        <el-table-column prop="name" align="center" width="200" label="角色">
          <!-- 自定义列结构，#default可以写成v-slot:default，也可以写成v-slot -->
          <template #default="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200" label="启用">
          <template #default="{ row }">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>  {{ row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无" }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template #default="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" size="mini" type="textarea" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!-- 放置操作按钮 -->
          <template #default="{ row }">
            <template v-if="row.isEdit">
              <!-- 编辑状态 -->
              <el-button type="primary" size="mini" @click="btnEditOK(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <el-button size="mini" type="text" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button size="mini" type="text" @click="btnEditRow(row)">编辑</el-button>
              <!-- popconfirm气泡确认框，onConfirm是监听点击确定触发的事件，气泡框有时候不好使 -->
              <!-- <el-popconfirm title="您确定要删除吗？" @onConfirm="confirmDel(row.id)">
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm> -->
              <el-button size="mini" type="text" style="margin-left:10px" @click="confirmDel(row.id)"> 删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" style="height:60px" align="middle" justify="end">
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置添加角色弹层 -->
    <!-- sync事件修饰符可以接收子组件$emit传来的参数然后直接付给对应的变量showDialog -->
    <el-dialog width="500px" title="新增角色" :visible.sync="showDialog" @close="btnCancel">
      <!-- 表单内容 -->
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width:300px" size="mini" />
        </el-form-item>
        <!-- 如果不需要校验就不需要写prop属性，但是重置表单数据需要prop属性 -->
        <el-form-item prop="state" label="启用">
          <!-- el-switch中的active-value可以让打开的值也就是roleForm中的state的值为1，inactive-value让关闭的值为0 -->
          <!-- 原本打开为true，关闭为false，然后把state修改为0或者1，是为了接口中的数据state要0或1，而不是true或false -->
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0" size="mini" />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width:300px" size="mini" />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 放置权限弹层 -->
    <el-dialog :visible.sync="showPermissionDialog" title="分配权限">
      <!-- default-checked-keys设置默认选中的节点 -->
      <!-- check-strictly在显示复选框的情况下，使父子不互相关联，解除父子必须一起选中的情况 -->
      <el-tree
        ref="permTree"
        check-strictly
        node-key="id"
        :data="permissionData"
        :props="{ label: 'name' }"
        show-checkbox
        default-expand-all
        :default-checked-keys="permIds"
      />
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="btnPermissionOK">确定</el-button>
          <el-button size="mini" @click="showPermissionDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, delRole, getRoleDetail, assignPerm } from '@/api/role'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      showDialog: false, // 控制添加角色弹层显示隐藏
      // 将分页信息放置到一个对象中
      pageParams: {
        page: 1, // 第几页
        pagesize: 5, // 每页多少条
        total: 0 // 一共多少条
      },
      roleForm: {
        name: '',
        description: '',
        state: 0
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      showPermissionDialog: false, // 控制权限弹层显示隐藏
      permissionData: [], // 存储接收的树形数据
      currentRoleId: null, // 记录分配权限按钮所在的角色的id
      permIds: [] // 默认选中的节点，为了回显
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows
      this.pageParams.total = total
      // 针对每一行数据添加一个编辑标记
      this.list.forEach(item => {
        // item.isEdit = false这样直接添加动态属性是不行的，因为默认这种直接添加动态属性不具备响应式
        // 数据响应式：数据变化，视图更新
        // this.$set(目标对象, 属性名称, 初始值) 可以针对目标对象添加的属性，添加响应式
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          name: item.name,
          state: item.state,
          description: item.description
        })
      })
    },
    // 切换分页时，请求新的数据
    changePage(newPage) {
      this.pageParams.page = newPage // 赋值当前页码
      this.getRoleList()
    },
    btnOK() {
      this.$refs.roleForm.validate(async isOK => {
        if (isOK) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.roleForm.resetFields() // 重置表单数据
      this.showDialog = false // 关闭弹层
    },
    // 点击编辑后的回显
    btnEditRow(row) {
      row.isEdit = true // 改变行的编辑状态
      // 更新缓存数据
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    // 编辑状态下点击确定时触发
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('更新角色成功')
        // 更新显示数据并退出编辑状态
        // row.name = row.editRow.name // eslint的误判
        // Object.assign()浅拷贝复制合并对象(具体的可以看前面用法)，可以规避eslint的误判
        Object.assign(row, {
          ...row.editRow,
          isEdit: false // 退出编辑模式
        })
      } else {
        this.$message.warning('角色和描述不能为空')
      }
    },
    // 删除状态下点击确定时触发
    async confirmDel(id) {
      await this.$confirm('确定要删除该数据吗', { type: 'warning' })
      await delRole(id) // 后端删除
      this.$message.success('删除角色成功')
      // 删除的如果是本页最后一个，那么就页码减一，然后请求回来就会自动渲染上一页的数据
      if (this.list.length === 1 && this.pageParams.page > 1) this.pageParams.page--
      this.getRoleList()
    },
    // 点击分配权限时触发
    async btnPermission(id) {
      this.permissionData = transListToTreeData(await getPermissionList(), 0)
      this.currentRoleId = id // 记录分配权限按钮所在的角色的id，因为后面确定取消要存取给对应的角色
      const { permIds } = await getRoleDetail(id) // 这一步是回显该角色的权限
      this.permIds = permIds
      this.showPermissionDialog = true
    },
    // 权限弹层点击确定时触发
    async btnPermissionOK() {
      await assignPerm({
        id: this.currentRoleId,
        // 树组件没有v-model，在页面中选中复选框并不能更改permIds的值，所以要利用树组件自带的getCheckedKeys方法
        // 这个方法的功能是：若节点可被选择(即show-checkbox为true)，则返回目前被选中的节点的key所组成的数组
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('角色分配权限成功')
      this.showPermissionDialog = false
    }
  }
}
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
