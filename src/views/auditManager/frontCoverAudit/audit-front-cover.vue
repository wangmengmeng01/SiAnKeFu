<template>
  <div class="audit-front-cover">

    <el-button v-if="[1, 2].includes(row.auditStatus)" type="text" size="mini" disabled>已操作</el-button>
    <el-button v-if="row.auditStatus === 0" type="danger" plain size="mini" @click="audit(0)">拒绝</el-button>
    <el-button v-if="row.auditStatus === 0" type="success" plain size="mini" @click="audit(1)">通过</el-button>

    <!-- dialog部分 -->
    <el-dialog title="拒绝" :visible.sync="visible" :close-on-click-modal="false" append-to-body width="500px" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="备注" prop="auditRemark">
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
  name: 'AuditFrontCover',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
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
    audit(logic) {
      if (logic === 1) {
        this.loading = true
        API[this.$route.path].audit({ ids: [this.row.id], logic: 1 }).then((res) => {
          this.$message.success('审核完成')
          this.$emit('success')
          this.loading = false
        }).catch((err) => {
          this.loading = false
          console.log(err)
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
          API[this.$route.path].audit({ ids: [this.row.id], logic: 0, auditRemark: this.form.auditRemark }).then((res) => {
            this.$message.success('审核完成')
            this.$emit('success')
            this.loading = false
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
  .audit-front-cover {
    display: inline-block;
    margin: 0 15px;
  }
</style>
