<template>
  <div class="multiple-audit">

    <el-button type="primary" size="small" style="width: 100px;" icon="" :plain="ids.length===0" :disabled="ids.length===0" @click="audit(1)">批量通过</el-button>
    <el-button type="danger" size="small" style="width: 100px;" :plain="ids.length===0" :disabled="ids.length===0" @click="audit(2)">批量拒绝</el-button>

    <!-- dialog部分 -->
    <el-dialog title="拒绝" :visible.sync="visible" :close-on-click-modal="false" width="500px" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入拒绝的理由（30个字以内）" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" maxlength="30" />
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
import API from '@/api/personal-show-manager'
export default {
  name: 'MultipleAudit',
  props: {
    ids: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      form: {
        remark: ''
      },
      rules: {
        remark: [{ required: true, message: '拒绝请输入理由' }]
      },
      loading: false
    }
  },
  methods: {
    audit(action) {
      if (action === 1) {
        this.loading = true
        API[this.$route.path].audit({ showIds: this.ids, action: 1 }).then((res) => {
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
          API[this.$route.path].audit({ showIds: this.ids, action: 2, remark: this.form.remark }).then((res) => {
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
  .multiple-audit {
    display: inline-block;
  }
</style>
