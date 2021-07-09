<template>
  <div>
    <el-form ref="dataForm" :disabled="!isEdit" :rules="rules" :model="form" label-width="100px" style="width: 660px; margin-top: 20px;">
      <el-form-item v-for="(item, index) in form.configInfo" :key="index" :label="'序号' + (index + 1) + '：'">
        <el-row type="flex" align="middle">
          <el-input v-model="item.diamondNumber" type="number" />
          <el-button v-show="isEdit" type="danger" style="margin-left: 15px;" @click="handleRemove(index)">删除</el-button>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button v-show="isEdit && form.configInfo.length < 10" type="primary" @click="add">+新增选项</el-button>
      </el-form-item>
      <el-form-item label="默认选中">
        <el-radio-group v-model="form.selected" @change="seletedChange">
          <el-radio v-for="(item, index) in form.configInfo" :key="index" :label="item.configId">序号{{ index + 1 }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form label-width="100px">
      <el-form-item>
        <el-row type="flex" align="middle" style="margin-top: 20px; margin-bottom: 40px;">
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
        configInfo: [],
        selected: undefined
      },
      rules: {
        amount: [
          { required: true, message: '请填写金额', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'form.configInfo'(configInfo) {
      let selected
      configInfo.forEach(item => {
        if (item.selected) {
          selected = item.configId
        }
      })
      this.form.selected = selected
    }
  },
  created() {
    this.$api = API[this.$route.path]
    this.getConfig()
  },
  methods: {
    async getConfig() {
      const { data } = await this.$api.getMoodConfig({})
      this.form.configInfo = data.configInfo || []
    },
    submit() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const configInfo = this.form.configInfo.map(item => {
            return {
              configId: item.configId,
              diamondNumber: item.diamondNumber,
              selected: item.configId === this.form.selected
            }
          })
          let canSubmit = true
          const g = /^[1-9]*[1-9][0-9]*$/
          this.form.configInfo.forEach((item, index) => {
            if (parseInt(item.diamondNumber) < 1 || parseInt(item.diamondNumber) > 100000 || !(g.test(item.diamondNumber))) {
              canSubmit = false
            }
          })
          if (!canSubmit) {
            this.$message.warning(`填写金额需为1~100000的正整数！`)
            return
          }
          if (!this.form.selected) {
            this.$message.warning(`请设置默认选项！`)
            return
          }
          await this.$api.saveMoodConfig({ configInfo })
          this.getConfig()
          this.$message.success('操作成功')
          this.isEdit = false
        }
      })
    },
    add() {
      this.form.configInfo.push({
        configId: undefined,
        diamondNumber: undefined,
        selected: false
      })
    },
    handleRemove(index) {
      this.form.configInfo.splice(index, 1)
    },
    cancelEdit() {
      this.isEdit = false
      this.getConfig()
    },
    seletedChange(value) {
      // debugger
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
