<template>
  <div class="upload-container">
    <el-upload
      action=""
      accept=".png, .jpg, .jpeg"
      :http-request="fileRequest"
      :before-upload="beforeImageUpload"
      :show-file-list="false"
    >
      <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary">
        插入图片
      </el-button>
    </el-upload>
  </div>
</template>

<script>

const OSS = require('ali-oss')
import { getOssToken } from '@/api/user'

export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    fileRequest(item) {
      this.fileList = []
      const self = this
      getOssToken().then(response => {
        const policy = response.data
        const client = new OSS({
          endpoint: policy.endPoint,
          accessKeyId: policy.accessKeyId,
          accessKeySecret: policy.accessKeySecret,
          bucket: policy.bucketName,
          stsToken: policy.securityToken
        })
        client.put(policy.filePrefix + item.file.name, item.file).then((res) => {
          self.fileList = []
          self.fileList.push({
            url: res.res.requestUrls[0],
            fileUrl: res.res.requestUrls[0],
            name: res.name
          })
          self.$emit('successCBK', self.fileList)
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return isJPG || isPNG
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return isLt1M
      }
      return (isJPG || isPNG) && isLt1M
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  .el-upload--picture-card {
    width: 100%;
  }
}
</style>
