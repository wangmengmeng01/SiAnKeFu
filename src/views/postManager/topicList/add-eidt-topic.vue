<template>
  <div class="add-edit-topic">

    <!-- button部分 -->
    <el-button :type="btnType" :icon="type==='edit'?'':'el-icon-plus'" :plain="type==='edit'" :size="btnSize" @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog :title="type==='edit'?'编辑话题':'创建话题'" :visible.sync="visible" :close-on-click-modal="false" append-to-body width="500px" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="100px">
        <el-form-item label="话题名称" prop="content">
          <el-input v-model="form.content" placeholder="请输入话题名称（15个字以内）" type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" maxlength="15" />
        </el-form-item>
        <el-form-item label="话题简介" prop="synopsis">
          <el-input v-model="form.synopsis" placeholder="请输入话题简介（100个字以内）" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" maxlength="100" />
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
import API from '@/api/post-manager'
export default {
  name: 'AddEditTopic',
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'small'
    },
    type: String,
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      form: {
        topicId: '',
        content: '',
        synopsis: ''
      },
      rules: {
        content: [{ required: true, message: '请输入话题名称' }],
        synopsis: [{ required: true, message: '请输入话题简介' }]
      },
      loading: false
    }
  },
  methods: {
    init() {
      if (this.type === 'edit') {
        this.form.topicId = this.row.topicId
        this.form.content = this.row.content
        this.form.synopsis = this.row.synopsis
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
.add-edit-topic{
  display: inline-block;
  margin-right: 15px;
}
</style>
