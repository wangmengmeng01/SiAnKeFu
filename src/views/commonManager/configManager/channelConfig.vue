<template>
  <div>
    <el-form ref="dataForm" :disabled="!isEdit" :rules="rules" :model="form" label-width="120px" style="width: 660px; margin-top: 20px;">
      <template v-if="!isEdit">
        <el-form-item label="每日免费条数：">
          <el-input v-model="form.amount" />
        </el-form-item>
        <el-form-item label="付费消息金额：">
          <el-input v-model="form.freeCount" />
        </el-form-item>
      </template>
      <template v-if="isEdit">
        <el-form-item label="每日免费条数：" prop="amount">
          <el-input v-model="form.amount" />
        </el-form-item>
        <el-form-item label="付费消息金额：" prop="freeCount">
          <el-input v-model="form.freeCount" />
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
        amount: undefined,
        freeCount: undefined
      },
      rules: {
        amount: [
          { required: true, message: '请填写金额', trigger: 'blur' }
        ],
        freeCount: [
          { required: true, message: '请填写金额', trigger: 'blur' }
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
      const { data } = await this.$api.getChannelConfig({})
      this.form.amount = data.configInfo.amount
      this.form.freeCount = data.configInfo.freeCount
    },
    submit() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          await this.$api.saveChannelConfig({ configInfo: this.form })
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
