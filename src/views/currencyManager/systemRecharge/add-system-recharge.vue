<template>
  <div class="add-system-recharge">

    <!-- button部分 -->
    <el-button :type="btnType" icon="el-icon-plus" :size="btnSize" @click="init"><slot /></el-button>
    <el-button type="primary" size="small" icon="el-icon-download" @click="exportFile()">导出</el-button>
    <!-- dialog部分 -->
    <el-dialog title="系统充值" :visible.sync="visible" :close-on-click-modal="false" width="500px" top="5vh" append-to-body @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="ID" prop="saId">
          <el-input v-model="form.saId" />
        </el-form-item>
        <el-form-item label="充值数量" prop="amount">
          <el-input v-model="form.amount" maxlength="8" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注（15个字以内）" type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" maxlength="15" />
        </el-form-item>
      </el-form>

      <div class="last-form-item">
        <el-button :loading="loading" type="primary" @click="submit">充值</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>

    </el-dialog>

  </div>
</template>

<script>
import API from '@/api/currency-manager'
import Validate from '@/utils/validate'
export default {
  name: 'AddSystemRecharge',
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'small'
    },
    row: {
      type: Object,
      default: () => null
    },
    getTablePageListParams: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      visible: false,
      form: {
        saId: '',
        amount: '',
        remark: ''
      },
      rules: {
        saId: [Validate.required('ID')],
        amount: [Validate.required('数量'), Validate.integer],
        remark: [Validate.required('备注')]
      },
      loading: false
    }
  },
  methods: {
    init() {
      this.visible = true
    },
    exportFile() {
      this.$store.dispatch("app/exportFile",{
        url: '/console/member/recharge/downloadSystemRecharge',
        data: this.getTablePageListParams,
        name: '系统充值',
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          API[this.$route.path].create(this.form).then(() => {
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
  .add-system-recharge {
    display: inline-block;
  }
</style>
