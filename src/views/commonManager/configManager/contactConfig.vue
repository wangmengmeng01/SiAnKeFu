<template>
  <div>
    <el-form ref="dataForm" :disabled="!isEdit" :rules="rules" :model="form" label-width="120px" style="width: 660px; margin-top: 20px;">
      <template v-if="!isEdit">
        <el-form-item label="客服微信：">
          <el-input v-model="form.customerWeiXin" />
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input v-model="form.customerEmail" />
        </el-form-item>
      </template>
      <template v-if="isEdit">
        <el-form-item label="客服微信：" prop="customerWeiXin">
          <el-input v-model="form.customerWeiXin" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="customerEmail">
          <el-input v-model="form.customerEmail" />
        </el-form-item>
      </template>
    </el-form>
    <el-form label-width="120px">
      <el-form-item>
        <el-row type="flex" align="center" style="margin-top: 20px; margin-bottom: 40px;">
          <el-button v-show="!isEdit" type="primary" @click="isEdit = true">修改配置</el-button>
          <el-button v-show="isEdit" type="primary" style="width: 100px; margin-right: 20px;" @click="submit">保存配置</el-button>
          <el-button v-show="isEdit" type="primary" style="width: 100px;" @click="cancelEdit">恢复</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import API from '@/api/common-manager'
export default {
  components: {

  },
  data() {
    return {
      isEdit: false,
      form: {
        customerWeiXin: undefined,
        customerEmail: undefined
      },
      rules: {
        customerWeiXin: [
          { required: true, message: '请填写客服微信', trigger: 'blur' }
        ],
        customerEmail: [
          { required: true, message: '请填写邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$api = API[this.$route.path]
    this.getConfig()
  },
  methods: {
    async getConfig() {
      const { data } = await this.$api.getContactConfig({})
      this.form.customerWeiXin = data.customerWeiXin
      this.form.customerEmail = data.customerEmail
    },
    submit() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          await this.$api.saveContactConfig(this.form)
          this.$message.success('操作成功')
          this.isEdit = false
        }
      })
    },
    cancelEdit() {
      this.isEdit = false
      this.getConfig()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
