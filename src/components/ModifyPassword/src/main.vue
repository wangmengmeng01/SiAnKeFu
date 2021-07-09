<template>
  <el-dialog
    title="修改密码"
    :visible.sync="show"
    center
    :close-on-click-modal="false"
    :show-close="submiting !== 0"
    width="500px"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" :minlength="6" :maxlength="16" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" :minlength="6" :maxlength="16" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmationPassword">
        <el-input v-model="form.confirmationPassword" type="password" :minlength="6" :maxlength="16" />
      </el-form-item>
      <div class="last-form-item">
        <el-button :disabled="submiting === 0" @click="show = !show">取消</el-button>
        <el-button :loading="submiting === 0" type="primary" @click="submitForm">确认</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { modifyPassword } from '@/api/user'
import { validPassword } from '@/utils/validate'
export default {
  name: 'ModifyPassword',
  props: {
    value: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    const passwordValidate = (rule, value, callback) => {
      callback(validPassword(value))
    }
    const confirmPass = (rule, value, callback) => {
      if (this.form.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      show: this.value,
      submiting: -1,
      form: { oldPassword: '', newPassword: '', confirmationPassword: '' },
      rules: {
        oldPassword: [{ required: true, validator: passwordValidate, trigger: 'blur' }],
        newPassword: [{ required: true, validator: passwordValidate, trigger: 'blur' }],
        confirmationPassword: [{ required: true, validator: confirmPass, trigger: 'change' }]
      }
    }
  },
  watch: {
    value(v) {
      if (v) {
        this.submiting = -1
        this.form = { oldPassword: '', newPassword: '', confirmationPassword: '' }
        this.$refs.form && this.$refs.form.resetFields()
      }
      this.show = !!v
    },
    show(v) {
      if (!v) {
        this.$emit('input', v)
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(async valid => {
        try {
          if (!valid) return
          this.submiting = 0
          await modifyPassword(this.form)
          this.$message.success('修改成功，请重新登录')
          setTimeout(() => {
            this.submiting = -1
            this.show = !this.show
            this.$store.dispatch('user/logout').then(() => window.location.reload())
          }, 1500)
        } catch (ex) {
          this.submiting = -1
          this.$message.error(ex.message)
          console.log(ex.message)
        }
      })
    }
  }
}
</script>

<style>

</style>
