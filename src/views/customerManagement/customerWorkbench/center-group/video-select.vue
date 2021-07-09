<template>
  <el-upload
    action=""
    class="picture-select"
    accept="video/Ogg,video/MP4,video/WebM"
    :http-request="fileRequest"
    :show-file-list="false"
  >
    <svg-icon icon-class="icon-picture" style="font-size: 28px; cursor: pointer;" />
  </el-upload>
</template>

<script>
const OSS = require('ali-oss')
import { getOssToken } from '@/api/user'
import utilsTool from './video.js'
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
          console.log(item,'66666')
          this.getImageInfo(item.file).then((newFile) => {
            this.$emit('select', newFile)
            console.log(newFile,'newFile')
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
        const { width, height ,src} = await this.getImageWidthHeight(file)
        newFile.width = width
        newFile.height = height
        newFile.coverUrl = src
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
      	var videoObj = document.createElement("video");
      	videoObj.style.cssText = "position:fixed; top:0; left:-100%; visibility:hidden";
				videoObj.src = file.url;
        videoObj.load();
        // videoObj.onloadedmetadata = function (evt) {
        videoObj.onloadeddata = function (evt) {
            console.log(videoObj.videoWidth , videoObj.videoHeight,6666666);
            // 执行上传的方法，获取外网路径，上传进度等
          var canvas = document.createElement("canvas");
					canvas.width = videoObj.videoWidth * 0.8;
					canvas.height = videoObj.videoHeight * 0.8;
					canvas.getContext('2d').drawImage(videoObj, 0, 0, canvas.width, canvas.height);
					let src = canvas.toDataURL("image/png");
					resolve({
            src: src,
            width: videoObj.videoWidth,
            height: videoObj.videoHeight
          })
        };
      })
    },
    getImageType(file) {
      if (file.type === 'video/mp4') {
        return {
          ext: 'mp4',
          size: file.size
        }
      } else if (file.type === 'video/ogg') {
        return {
          ext: 'ogg',
          size: file.size
        }
      } else if (file.type === 'video/WebM') {
        return {
          ext: 'WebM',
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
