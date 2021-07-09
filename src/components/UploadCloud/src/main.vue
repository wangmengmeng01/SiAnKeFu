<template>
  <el-upload
    ref="UploadControl"
    class="upload-cloud-control"
    :class="{
      'upload-cloud-control-single': limit === 1 && files.length > 0
    }"
    :action="url"
    :drag="drag"
    :disabled="disabled"
    :headers="headers"
    :multiple="multiple"
    :limit="limit"
    :on-preview="handlePreview"
    :on-progress="handleProgress"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-remove="handleRemove"
    :before-upload="beforeUploadInner"
    :before-remove="beforeRemoveInner"
    :on-exceed="handleExceed"
    :file-list="files"
    :auto-upload="autoUpload"
    :http-request="httpRequest"
    :show-file-list="showFileList"
    :data="params"
    :with-credentials="withCredentials"
    :accept="accept"
    :list-type="listType"
  >
    <slot v-if="!!$slots.default" slot="default" />
    <i v-else class="el-icon-upload" />
    <div v-if="!!$slots.tip" slot="tip" class="el-upload__tip"><slot name="tip" /></div>
    <template slot="file" slot-scope="{file}">
      <el-image
        v-if="fileType === 'image'"
        :ref="file.url"
        :src="file.url"
        class="el-upload-list__item-thumbnail el-upload-list__item-image"
        :preview-src-list="[file.url]"
      />
      <div
        v-else
        :ref="file.url"
        :src="file.url"
        class="el-upload-list__item-thumbnail el-upload-list__item-file"
      >
        <i class="el-icon-document" style="font-size: 50px;" />
      </div>
      <div class="el-upload-list__item-actions">
        <span
          v-if="preview"
          class="btn-file-preview"
          title="预览"
          @click="fileAction('preview', file)"
        >
          <i class="el-icon-zoom-in" />
        </span>
        <span
          v-if="removable"
          class="btn-file-delete"
          title="删除"
          @click="fileAction('remove', file)"
        >
          <i class="el-icon-delete" />
        </span>
        <span
          v-if="download"
          class="btn-file-delete"
          title="下载"
          @click="fileAction('download', file)"
        >
          <i class="el-icon-download" />
        </span>
      </div>
    </template>
  </el-upload>
</template>
<script>
import props from './upload-props'
import getUploadConfig, { uuid } from './get-upload-config'
export default {
  name: 'UploadCloud',
  props,
  data() {
    return {
      url: this.action,
      files: this.getValue(this.value),
      params: {
        ...(this.data || {})
      }
    }
  },
  watch: {
    value(v) {
      this.files = this.getValue(v)
    }
  },
  methods: {
    fileAction(action, file) {
      let i
      switch (action) {
        case 'preview':
          if (this.fileType === 'image') {
            this.$refs[file.url].showViewer = !this.$refs[file.url].showViewer
          } else {
            this.$message.warning('该文件不支持预览')
          }
          break
        case 'remove':
          i = this.files.findIndex(f => f.url === file.url)
          if (i > -1) {
            this.files.splice(i, 1)
            this.notify(this.files)
          }
          break
        case 'download':
          break
      }
    },
    getValue(v) {
      if (Array.isArray(v)) {
        return v
      } else {
        return v ? [{ url: v }] : []
      }
    },
    beforeUploadInner(file) {
      if (!this.isValid(file)) return false
      this.$emit('upload', {
        status: 'before_upload',
        file: file
      })
      return this.getUrl().then(config => {
        if (typeof config === 'object') {
          console.log(file)
          const key = config.filePrefix + '-' + uuid() + file.name.slice(file.name.lastIndexOf('.'))
          file.url = config.ossPrefix + '/' + key
          this.params = {
            ...this.params,
            key
          }
        }
        if (this.beforeUpload) {
          return this.beforeUpload(file)
        }
        return true
      }).catch(ex => Promise.reject(ex))
    },
    isValid(file) {
      const size = Number(this.size) * 1024 * 1024
      if (size < file.size) {
        if (this.errorTip) this.$message.error('文件过大，请重新上传')
        return false
      }
      if (this.accept && this.accept.indexOf(file.type) < 0) {
        if (this.errorTip) this.$message.error('文件格式错误，请重新上传')
        return false
      }
      return true
    },
    handlePreview(file) {
      this.$emit('upload', {
        status: 'preview',
        file: file
      })
    },
    handleProgress(event, file, files) {
      this.$emit('upload', {
        status: 'pending',
        file: file
      })
    },
    handleSuccess(res, file, files) {
      file.url = file.url || (file.raw && file.raw.url)
      files.forEach(file => {
        file.url = file.url || (file.raw && file.raw.url)
      })
      this.$emit('upload', {
        status: 'success',
        file: file
      })
      this.notify(files)
    },
    handleError(err, file, files) {
      if (this.errorTip) {
        this.$message.error('文件上传失败')
      }
      this.$emit('upload', {
        status: 'error',
        error: err.message,
        file: file
      })
    },
    beforeRemoveInner(file) {
      this.$emit('upload', {
        status: 'before_remove',
        file: file
      })
      if (this.beforeRemove) return this.beforeRemove(file)
      return true
    },
    handleRemove(file, files) {
      this.$emit('upload', {
        status: 'removed',
        file: file
      })
      this.notify(files)
    },
    handleExceed(file, files) {
      if (this.errorTip) {
        this.$message.error('文件超出限制')
      }
      this.$emit('upload', {
        status: 'exceed',
        file: file
      })
    },
    notify(files) {
      let v
      if (this.multiple) {
        v = files
      } else {
        v = (files && files.length && files[0].url) || ''
      }
      this.$emit('input', v)
    },
    async getUrl() {
      try {
        if (typeof this.action === 'string' && this.action.length) {
          return Promise.resolve(this.action)
        }
        const config = await getUploadConfig(this.size)
        this.url = config.ossPrefix
        this.params = {
          ...this.params,
          OSSAccessKeyId: config.OSSAccessKeyId,
          policy: config.policy,
          signature: config.signature,
          'x-oss-security-token': config.securityToken
        }
        return { ...config }
      } catch (ex) {
        return Promise.reject(ex)
      }
    }
  }
}
</script>
<style lang="scss" src="./style.scss" scoped />
