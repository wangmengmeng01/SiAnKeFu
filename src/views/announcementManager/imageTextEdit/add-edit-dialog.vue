<template>
  <div class="add-edit-dialog">

    <!-- button部分 -->
    <el-button :type="btnType" :icon="type==='edit'?'':'el-icon-plus'" :plain="type==='edit'" :size="btnSize" @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="编辑" :visible.sync="visible" :close-on-click-modal="false" append-to-body top="2vh" width="95%" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="80px">
        <el-form-item label="备注" prop="title">
          <el-input v-model="form.title" placeholder="添加一条备注信息" />
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
import API from '@/api/announcement-manager'
import request from '@/api/httpRequest'
import Tinymce from '@/components/Tinymce'
export default {
  name: 'AddEditDialog',
  components: { Tinymce },
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
        id: '',
        title: '',
        content: ''
      },
      rules: {
        title: [{ required: true, message: '请输入备注信息' }],
        content: [{ required: true, message: '请输入图文内容' }]
      },
      loading: false
    }
  },
  methods: {
    init() {
      if (this.type === 'edit' && !!this.row) {
        request({
          url: `/console/graphicLibrary/getById/${this.row.id}`,
          method: 'get'
        }).then((res) => {
          this.form.id = res.data.id
          this.form.title = res.data.title
          this.form.content = res.data.content
          this.visible = true
        }).catch(error => {
          console.log(error)
        })
      } else {
        this.visible = true
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.form)
          this.loading = true
          API[this.$route.path][this.type === 'edit' ? 'update' : 'create'](params).then(() => {
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
