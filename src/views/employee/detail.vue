<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="220px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <!-- 工号是系统生成的，所以要禁用工号的修改 -->
                <el-input v-model="userInfo.workNumber" disabled size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <!-- 如果有id代表是查看，那么就禁用手机号的修改，!!表示两次取反，转成布尔值 -->
                <el-input v-model="userInfo.mobile" :disabled="!!$route.params.id" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 级联部门组件单独封装-->
                <!-- inputW样式会给到selectTree中template第一层的组件 -->
                <!-- v-model使用在组件中，是:value和input的连招 -->
                <select-tree v-model="userInfo.departmentId" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userInfo.formOfEmployment" size="mini" class="inputW">
                  <el-option label="正式" :value="1" />
                  <el-option label="非正式" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker v-model="userInfo.timeOfEntry" size="mini" type="date" value-format="yyyy-MM-dd" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker v-model="userInfo.correctionTime" size="mini" type="date" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 上传图片单独封装组件 -->
                <image-upload v-model="userInfo.staffPhoto" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="12" style="margin-left:220px">
              <el-button size="mini" type="primary" @click="saveData">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import SelectTree from './components/select-tree.vue'
import ImageUpload from './components/image-upload.vue'
import { addEmployee, getEmployeeDetail, updateEmployee } from '@/api/employee'
export default {
  components: { SelectTree, ImageUpload },
  data() {
    return {
      // 数据名称一定要参考接口文档的数据名称
      userInfo: {
        username: '', // 用户名
        mobile: '', // 手机号
        workNumber: '', // 工号
        formOfEmployment: null, // 聘用形式
        departmentId: null, // 部门id
        timeOfEntry: '', // 入职时间
        correctionTime: '', // 转正时间
        staffPhoto: '' // 头像
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 4, message: '姓名为1-4位' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        correctionTime: [
          { required: true, message: '请选择转正时间', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (this.userInfo.timeOfEntry) {
                if (new Date(this.userInfo.timeOfEntry) > new Date(value)) {
                  callback(new Error('转正时间不能小于入职时间'))
                  return
                }
              }
              callback()
            }
          }]
      }
    }
  },
  created() {
    // 如何获取路由参数的中id
    this.$route.params.id && this.getEmployeeDetail()
  },
  methods: {
    async getEmployeeDetail() {
      this.userInfo = await getEmployeeDetail(this.$route.params.id)
    },
    saveData() {
      this.$refs.userForm.validate(async isOK => {
        if (isOK) {
          if (this.$route.params.id) {
            // 编辑模式
            await updateEmployee(this.userInfo)
            this.$message.success('更新员工成功')
          } else {
            // 新增模式
            await addEmployee(this.userInfo)
            this.$message.success('新增员工成功')
          }
          this.$router.push('/employee')
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;
  .inputW {
    width: 380px
  }
}
</style>

