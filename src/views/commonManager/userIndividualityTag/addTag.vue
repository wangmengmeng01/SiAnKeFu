<template>
  <div class="add-tag">

    <!-- button部分 -->
    <el-button :type="btnType" icon="el-icon-plus" :size="btnSize" @click="visible = true"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="新增标签" :visible.sync="visible" :close-on-click-modal="false" width="500px" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="标签名" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名（10个字以内）" maxlength="10" />
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
  name: 'AddTag',
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
        name: '',
        status: ''
      },
      rules: {
        name: [{ required: true, message: '请输入标签名' }],
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
            name: this.form.name,
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
