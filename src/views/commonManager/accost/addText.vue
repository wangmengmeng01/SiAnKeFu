<template>
  <div class="add-text">

    <!-- button部分 -->
    <el-button :type="btnType" icon="el-icon-plus" :size="btnSize" @click="visible = true"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="新增文案" :visible.sync="visible" :close-on-click-modal="false" width="500px" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="文案内容" prop="content">
          <el-input v-model="form.content" placeholder="请输入文案内容（50个字以内）" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" maxlength="50" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <sa-select v-model="form.status" :options="[{label: '已上架', value: '1'}, {label: '已下架', value: '0'}]" />
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
import saSelect from '@/components/Select'
export default {
  name: 'AddText',
  components: { saSelect },
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
        type: 2,
        content: '',
        status: ''
      },
      rules: {
        content: [{ required: true, message: '请输入文案内容' }],
        status: [{ required: true, message: '请选择状态' }]
      },
      loading: false
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            type: this.form.type,
            content: this.form.content,
            status: Number(this.form.status)
          }
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
