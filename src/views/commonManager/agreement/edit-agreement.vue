<template>
  <div class="edit-agreement">

    <!-- button部分 -->
    <el-button :type="btnType" :size="btnSize" plain @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="编辑协议" :visible.sync="visible" :close-on-click-modal="false" append-to-body top="2vh" width="95%" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="80px">
        <el-form-item label="协议名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入协议名称" />
        </el-form-item>
        <el-form-item label="协议标识">
          <el-input v-model="['', '用户协议', '关于', '直播协议', '隐私协议'][Number(row.type)]" disabled />
        </el-form-item>
        <el-form-item prop="content" label-width="0">
          <Tinymce v-if="visible" ref="editor" v-model="form.content" height="400px" />
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
import API from '@/api/common-manager'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'EditAgreement',
  components: { Tinymce },
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'mini'
    },
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      form: {
        id: '',
        name: '',
        content: ''
      },
      rules: {
        name: [{ required: true, message: '请输入协议名称' }],
        content: [{ required: true, message: '请输入协议内容' }]
      },
      loading: false
    }
  },
  methods: {
    init() {
      this.form.id = this.row.id
      this.form.name = this.row.name
      this.form.content = this.row.content
      this.visible = true
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.form)
          this.loading = true
          API[this.$route.path].update(params).then(() => {
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

</style>
