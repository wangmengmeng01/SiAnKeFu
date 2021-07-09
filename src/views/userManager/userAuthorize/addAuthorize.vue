<template>
  <div class="add-authorize">

    <!-- button部分 -->
    <el-button :type="btnType" icon="el-icon-plus" :size="btnSize" @click="visible = true"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="新增平台授权" :visible.sync="visible" :close-on-click-modal="false" width="500px" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="ID" prop="saId">
          <el-input v-model="form.saId" placeholder="请输入用户ID，多个用户请用逗号隔开，单次最多可添加10个" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" />
        </el-form-item>
        <!-- <el-form-item label="">
          授权的用户需要为一重世界身份。
        </el-form-item> -->
      </el-form>

      <div class="last-form-item">
        <el-button :loading="loading" type="primary" @click="submit">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import API from '@/api/user-manager'
export default {
  name: 'AddAuthorize',
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
        saId: ''
      },
      rules: {
        saId: [{ required: true, message: '请输入用户ID' }]
      },
      loading: false
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            saIdList: this.form.saId.split(',')
          }
          this.loading = true
          API[this.$route.path].grantAuthIdentity(params).then(() => {
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
