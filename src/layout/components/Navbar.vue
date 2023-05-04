<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <!-- 当前面的内容是null或者是undefined就不再往下继续了，这个时候可以加一个? 这是可选链操作符 -->
          <!-- 需要升级vue和vue-template-compiler的版本为2.7.0 -->
          <!-- npm i vue@2.7.0	vue-template-compiler@2.7.0 -->
          <!-- 用户名称 -->
          <span class="name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/wu-hao-ze">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- prevent阻止默认事件 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item @click="showDialog = true">修改密码</el-dropdown-item>
          </a>
          <!-- native事件修饰符 -->
          <!-- el-dropdown-item这个组件是没有click事件的，所以直接写@click是不起作用的 -->
          <!-- 通过.native修饰符可以绑定原生事件，比如这里的click，使用完native之后click才能起作用 -->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 放置dialog对话框 -->
    <el-dialog width="500px" title="修改密码" :visible="showDialog" @close="btnCancel">
      <!-- 放置表单 -->
      <el-form ref="passForm" label-width="120px" :model="passForm" :rules="rules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="btnOK">确认修改</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false, // 控制弹层的显示和隐藏
      passForm: {
        oldPassword: '', // 旧密码
        newPassword: '', // 新密码
        confirmPassword: '' // 确认密码字段
      },
      rules: {
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '新密码的长度为6-16位之间', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '重复密码不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => { // 一定要箭头函数，因为箭头函数的this在这里的位置决定指向组件实例
              this.passForm.newPassword === value ? callback() : callback(new Error('重复密码和新密码输入不一致'))
            },
            trigger: 'blur'
          }]
      }
    }
  },
  computed: {
    // 引入头像和用户名称
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    updatePassword() {
      this.showDialog = true // 显示弹层
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // 调用退出登录的action
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    btnOK() {
      this.$refs.passForm.validate(async isOK => {
        if (isOK) {
          // 调用接口
          await updatePassword(this.passForm)
          this.$message.success('修改密码成功')
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.passForm.resetFields() // 重置表单
      this.showDialog = false // 关闭弹层
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
      }
    }

    .avatar-container {
      margin-right: 30px;
      cursor: pointer;
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .name {
          // 用户名称距离右侧距离
          margin-right: 10px;
          font-size: 16px;
        }
        .username {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background: #04c9be;
          color: #fff;
          margin-right: 4px;
        }
        .el-icon-setting {
          font-size: 20px;
        }
        .user-avatar {
          cursor: pointer;
          margin-right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
