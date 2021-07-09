<template>
  <div class="audit-post">

    <el-button v-if="status === 1" type="text" size="mini" disabled>已通过</el-button>
    <el-button v-if="status === 0" type="text" size="mini" disabled>已拒绝</el-button>
    <template v-if="status === ''">
      <el-button type="success" size="mini" plain @click="audit(row.dynamicId, 1)">通过</el-button>
      <el-button type="danger" size="mini" plain @click="audit(row.dynamicId, 0)">拒绝</el-button>
    </template>

    <!-- dialog部分 -->
    <el-dialog title="拒绝" :visible.sync="visible" :close-on-click-modal="false" width="500px" append-to-body @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="" prop="auditRemark">
          <el-input v-model="form.auditRemark" placeholder="请输入拒绝的理由（30个字以内）" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" maxlength="30" />
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
import API from '@/api/audit-manager'
export default {
  name: 'AuditPost',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      status: '',
      visible: false,
      form: {
        auditRemark: ''
      },
      rules: {
        auditRemark: [{ required: true, message: '拒绝请输入理由' }]
      },
      loading: false
    }
  },
  methods: {
    audit(dynamicId, logic) {
      if (logic === 1) {
        this.$confirm(`确认要通过吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
            this.loading = true
            await API[this.$route.path].audit({ dynamicId, logic })
            this.$message.success('审核完成')
            this.loading = false
            this.status = logic
          } catch (error) {
            this.loading = false
            console.log(error)
          }
        }).catch(() => {
          console.log('用户取消操作')
        })
      } else {
        this.visible = true
      }
    },
    reset() {
      this.$refs.form.resetFields()
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          API[this.$route.path].audit({ dynamicId: this.row.dynamicId, logic: 0, auditRemark: this.form.auditRemark }).then((res) => {
            this.$message.success('审核完成')
            this.loading = false
            this.status = 0
            this.visible = false
          }).catch((err) => {
            this.loading = false
            console.log(err)
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
