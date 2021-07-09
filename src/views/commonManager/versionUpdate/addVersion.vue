<template>
  <div class="add-version">

    <!-- button部分 -->
    <el-button :type="btnType" icon="el-icon-plus" :size="btnSize" @click="visible = true"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="新增版本更新" :visible.sync="visible" :close-on-click-modal="false" width="500px" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="版本号" prop="versionNo">
          <el-input v-model="form.versionNo" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="系统" prop="platform">
          <dict-select v-model="form.platform" dict-type="version_upgrade_platform" :exclude="['-1']" />
        </el-form-item>
        <el-form-item label="下载地址" prop="downloadUrl">
          <el-input v-model="form.downloadUrl" placeholder="请输入下载地址" />
        </el-form-item>
        <el-form-item label="更新方式" prop="upgradeType">
          <dict-select v-model="form.upgradeType" dict-type="version_upgrade_type" :exclude="['-1']" />
        </el-form-item>
        <el-form-item label="更新内容" prop="summary">
          <el-input v-model="form.summary" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="请输入更新内容" />
        </el-form-item>
      </el-form>

      <div class="last-form-item">
        <el-button :loading="loading" type="primary" @click="submit">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import API from '@/api/common-manager'
import dictSelect from '@/components/DictSelect'
import Validate from '@/utils/validate.js'
export default {
  name: 'AddVersion',
  components: { dictSelect },
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      visible: false,
      form: {
        versionNo: '',
        platform: '',
        downloadUrl: '',
        upgradeType: '',
        summary: ''
      },
      rules: {
        versionNo: [{ required: true, message: '请输入版本号' }, Validate.version],
        platform: [{ required: true, message: '请选择系统' }],
        downloadUrl: [{ required: true, message: '请输入下载地址' }, Validate.link],
        upgradeType: [{ required: true, message: '请选择更新方式' }],
        summary: [{ required: true, message: '请输入更新内容' }]
      },
      loading: false
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.form)
          this.loading = true
          API[this.$route.path].create(params).then(() => {
            this.loading = false
            this.$emit('success')
            this.$message.success('操作成功')
            this.visible = false
          }).catch(error => {
            console.log(error)
            this.loading = false
          })
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
