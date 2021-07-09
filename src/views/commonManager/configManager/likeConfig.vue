<template>
  <div>
    <el-form ref="dataForm" :disabled="!isEdit" :rules="rules" :model="form" label-width="210px" style="width: 660px; margin-top: 20px;">
      <el-form-item v-show="!isEdit" :label="label">
        <el-input v-model="form.amount" />
      </el-form-item>
      <el-form-item v-show="isEdit" :label="label" prop="amount">
        <el-input v-model="form.amount" />
      </el-form-item>
    </el-form>
    <el-form label-width="175px">
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
import {
  getCallBalanceWarnLineConfig,
  updateCallBalanceWarnLineConfig,
  getUserShowLikeAmountConfig,
  updateUserShowLikeAmountConfig,
  getSendPmLimitConfig,
  updateSendPmLimitConfig,
  getVisitHomeLimitConfig,
  updateVisitHomeLimitConfig,
} from '@/api/configManager.js'
export default {
  props:['label',"type"],
  components: {

  },
  data() {
    return {
      isEdit: false,
      form: {
        amount: undefined
      },
      rules: {
        amount: [
          { required: true, message: '请填写金额', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // this.$api = API[this.$route.path]
    this.getConfig()
    // updateCallBalanceWarnLineConfig({amount: 5});
  },
  methods: {
    async getConfig() {
      if(this.type === "1") {
        getUserShowLikeAmountConfig().then(res => {
          if (res.success) {
            this.form.amount = res.data.configInfo.amount;
          }
        }).catch(err => {

        })
      }else if (this.type === "2") {
        getCallBalanceWarnLineConfig().then(res => {
          if (res.success) {
            this.form.amount = res.data.amount;
          }
        }).catch(err => {

        })
      }else if (this.type === "3") {
        getSendPmLimitConfig().then(res => {
          if (res.success) {
            this.form.amount = res.data.amount;
          }
        }).catch(err => {

        })
      }else if (this.type === "4") {
        getVisitHomeLimitConfig().then(res => {
          if (res.success) {
            this.form.amount = res.data.amount;
          }
        }).catch(err => {

        })
      }
    },
    submit() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const configInfo = { amount: this.form.amount }
          if(this.type === "1") {
            updateUserShowLikeAmountConfig({configInfo}).then(res => {
              if (res.success) {
                this.$message.success('操作成功')
                this.isEdit = false
              }
            }).catch(err => {

            })
          }else if (this.type === "2") {
            updateCallBalanceWarnLineConfig({amount: this.form.amount}).then(res => {
              if (res.success) {
                this.$message.success('操作成功')
                this.isEdit = false
              }
            }).catch(err => {

            })
          }else if (this.type === "3") {
            updateSendPmLimitConfig({amount: this.form.amount}).then(res => {
              if (res.success) {
                this.$message.success('操作成功')
                this.isEdit = false
              }
            }).catch(err => {

            })
          }else if (this.type === "4") {
            updateVisitHomeLimitConfig({amount: this.form.amount}).then(res => {
              if (res.success) {
                this.$message.success('操作成功')
                this.isEdit = false
              }
            }).catch(err => {

            })
          }
          // await this.$api.saveLikeConfig({ configInfo })
          // this.$message.success('操作成功')
          // this.isEdit = false
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
