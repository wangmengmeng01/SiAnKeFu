<template>
  <el-upload
    action=""
    class="picture-select"
    accept=".png, .jpg, .jpeg"
    :http-request="fileRequest"
    :show-file-list="false"
  >
    <svg-icon icon-class="icon-picture" style="font-size: 28px; cursor: pointer;" />
  </el-upload>
</template>

<script>
const OSS = require('ali-oss')
import { getOssToken } from '@/api/user'
import BMF from 'browser-md5-file'
const bmf = new BMF()

export default {
  name: 'PictureSelect',
  methods: {
    fileRequest(item) {
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
          item.file.url = res.res.requestUrls[0]
          this.getImageInfo(item.file).then((newFile) => {
            this.$emit('select', newFile)
          })
        }).catch((err) => {
          console.log(err)
        })
      })
    },
    async getImageInfo(file) {
      const newFile = {
        url: file.url,
        name: file.name
      }
      try {
        const md5 = await this.getImageMd5(file)
        newFile.md5 = md5
        const { width, height } = await this.getImageWidthHeight(file)
        newFile.width = width
        newFile.height = height
      } catch (err) {
        console.log(err)
      }
      return Object.assign({}, newFile, this.getImageType(file))
    },
    getImageMd5(file) {
      return new Promise((resolve, reject) => {
        bmf.md5(file, (err, md5) => {
          if (err) {
            reject(err)
          }
          if (md5) {
            resolve(md5)
          }
        }, progress => {})
      })
    },
    getImageWidthHeight(file) {
      return new Promise((resolve, reject) => {
        const imgObj = new Image()
        imgObj.src = file.url
        imgObj.onload = () => {
          resolve({
            width: imgObj.width,
            height: imgObj.height
          })
        }
        imgObj.onerror = () => {
          reject({
            width: '',
            height: ''
          })
        }
      })
    },
    getImageType(file) {
      if (file.type === 'image/jpeg') {
        return {
          ext: 'jpg',
          size: file.size
        }
      } else if (file.type === 'image/png') {
        return {
          ext: 'png',
          size: file.size
        }
      } else if (file.type === 'image/gif') {
        return {
          ext: 'gif',
          size: file.size
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.picture-select{
  display: inline-block;
  margin-left: 10px;
}
</style>
