<template>
  <!-- action是上传地址(自动上传)，人资项目不需要，因为人资项目(手动上传)，但是要设置为空字符串  -->
  <!-- show-file-list展示列表 -->
  <!-- http-request会覆盖默认的上传行为，可以自定义上传 -->
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
  >
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 检查函数，判断文件的类型还有大小，return true(继续上传)  return false(停止上传)
    beforeAvatarUpload(file) {
      // jpeg png gif bmp
      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 5 // 5M
      if (!isJPG) this.$message.error('上传头像图片只能是 JPG PNG GIF BMP 格式!')
      if (!isLt2M) this.$message.error('上传头像图片大小不能超过 5MB!')
      return isJPG && isLt2M
    },
    // 员工详情中上传图片的过程：自定义上传->上传到腾讯云服务器->腾讯云返回地址->通过input事件传出地址
    // 腾讯云是一个第三方服务器，可以帮助存储图片/音频/视频等，和后端代码完全分开，响应速度快，方便维护
    // 1.注册腾讯云账号https://cloud.tencent.com/login
    // 2.创建腾讯云存储桶：点击主页右侧控制台，点击上方云产品中的对象存储，然后创建存储桶，访问权限改为共有读私有写
    // 然后点击下一步完成创建，点击左侧安全管理下的跨域访问CORS设置，添加规则，设置为*，方法全选
    // 3.在概览处得到存储桶名称和所属地域名称
    // 存储桶名称：wu-hao-ze-1315739353
    // 所属地域：ap-shanghai
    // 然后左侧选择密钥管理，访问密钥，新建密钥
    // SecretId: AKID33IT1eJs591pUyFG3sfIgzCBxkSyGKCt
    // SecretKey: UmvtlRxISQrEPWYNAwW4d8Tly0ueDdyH
    // 安装腾讯云上传sdk，npm i cos-js-sdk-v5 或者 yarn add	cos-js-sdk-v5
    // 初始化COS
    // const cos = new COS({
    //   SecretId: "应用标识",
    //   SecretKey: "应用密钥"
    // })
    // cos.putObject(
    //   {
    //     Bucket: '存储桶名称',
    //     Region: '存储桶地域',
    //     Key: '文件名称',
    //     StorageClass: 'STANDARD',
    //     Body: '文件对象'
    //   },
    //   (err, data) => {
    //     // err错误信息	data返回数据
    //   }
    // )
    // COS是收费的，可以使用完清空存储桶并删除存储桶

    // 选择图片上传
    uploadImage(params) {
      // params是上传之后包装的对象
      console.log(params.file)
      // 完成cos对象的初始化
      const cos = new COS({
        SecretId: 'AKID33IT1eJs591pUyFG3sfIgzCBxkSyGKCt',
        SecretKey: 'UmvtlRxISQrEPWYNAwW4d8Tly0ueDdyH'
      })
      cos.putObject(
        {
          Bucket: 'wu-hao-ze-1315739353', // 存储桶名称
          Region: 'ap-shanghai', // 地域名称
          Key: params.file.name, // 文件名称
          StorageClass: 'STANDARD', // 固定值
          Body: params.file // 文件对象
        },
        (err, data) => {
          console.log(data)
          // data.Location是腾讯云返回的上传图片的地址
          if (data.statusCode === 200 && data.Location) {
            // 通过input自定义事件将地址传出去
            this.$emit('input', 'http://' + data.Location)
          } else {
            this.$message.error(err.Message) // 上传失败的提示消息
          }
        }
      )
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
