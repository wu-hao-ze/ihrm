<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary" @click="addPermission(0, 1)">添加权限</el-button>
      <!-- 渲染树形数据时，必须要指定row-key(行数据的Key，用来优化Table的渲染) -->
      <el-table default-expand-all :data="list" row-key="id">
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="code" label="标识" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <!-- row-key的那个id值就是list数组中的每一项的id值，这里使用的row.id也是对应的项的id值 -->
            <!-- 上面添加权限的传入的type参数是1，也就是说上面添加的和自带的初始化数据的type值都为1 -->
            <!-- 这里下面的添加的type值为2，也就是说只有上面添加的和初始化的才有添加按钮，这里添加过后就不能再添加了 -->
            <el-button v-if="row.type === 1" size="mini" type="text" @click="addPermission(row.id, 2)">添加</el-button>
            <el-button type="text" size="mini" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" size="mini" @click="delPermission(row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 放置一个弹层，用来编辑新增节点 -->
    <el-dialog :title="`${showText}权限点`" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启" prop="enVisible">
          <el-switch v-model="formData.enVisible" active-value="1" inactive-value="0" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList, updatePermission, addPermission, getPermissionDetail, delPermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      list: [],
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型，不需要显示到上面的弹层中，因为点击添加的时候已经知道类型了
        pid: '', // 因为树形数据，所以需要知道添加到哪个节点下
        enVisible: '0' // 开启
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), 0)
    },
    // 新增操作
    addPermission(pid, type) {
      // 实际上这个树形的数据中，pid的值只有0和1，对应的是有添加按钮的和没有添加按钮的
      this.showDialog = true
      this.formData.pid = pid
      this.formData.type = type
    },
    // 编辑操作
    async editPermission(id) {
      // 根据获取id获取详情
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    // 删除操作
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    btnOK() {
      this.$refs.perForm.validate().then(() => {
        // 如果有id值，代表是编辑
        if (this.formData.id) return updatePermission(this.formData)
        // 否则是新增
        return addPermission(this.formData)
      }).then(() => {
        if (this.formData.id) this.$message.success('更新成功')
        else this.$message.success('新增成功')
        this.getPermissionList()
        this.showDialog = false
      })
    },
    btnCancel() {
      // 注意！！！！！这里只使用重置表单是不准确的，因为重置表单只是对上面表单中的属性进行清空，而不会对额外属性清空
      // 编辑模式下会给formData赋值id，所以只重置表单是消不掉的，直接赋值原始数据才是解决的最好办法
      // this.$refs.perForm.resetFields()
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
      this.showDialog = false
    }
  }
}
</script>
<style>
.btn-add {
  margin: 10px;
}
</style>
