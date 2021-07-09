<template>
  <div class="add-edit-recharge">

    <!-- button部分 -->
    <el-button :type="btnType" :icon="type==='edit'?'':'el-icon-plus'" :plain="type==='edit'" :size="btnSize" @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog :title="type==='edit'?'编辑充值项':'新增充值项'" :visible.sync="visible" :close-on-click-modal="false" width="400px" top="5vh" append-to-body @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="人民币金额" prop="money">
          <el-input v-model="form.money">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="钻石数量" prop="diamondAmount">
          <el-input v-model="form.diamondAmount" maxlength="10">
            <template slot="append">颗</template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortNo">
          <el-input v-model="form.sortNo" maxlength="10" />
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
import API from '@/api/currency-manager'
import Validate from '@/utils/validate'
export default {
  name: 'AddEditRecharge',
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'small'
    },
    type: { // edit为编辑态 add为新增
      type: String,
      default: ''
    },
    row: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      visible: false,
      form: {
        id: '',
        money: '',
        diamondAmount: '',
        sortNo: ''
      },
      rules: {
        money: [Validate.required('金额'), Validate.money],
        diamondAmount: [Validate.required('数量'), Validate.integer],
        sortNo: [Validate.required('排序'), Validate.integer]
      },
      loading: false
    }
  },
  methods: {
    init() {
      if (this.type === 'edit' && !!this.row) {
        for (const key in this.form) {
          this.form[key] = this.row[key]
        }
      }
      this.visible = true
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          API[this.$route.path][this.type === 'edit' ? 'update' : 'create'](this.form).then(() => {
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
  .add-edit-recharge {
    display: inline-block;
    margin-right: 15px;
  }
</style>
