<template>
  <div class="add-edit-operator">

    <!-- button部分 -->
    <el-button :type="btnType" :plain="type==='edit'" :icon="type==='edit'?'':'el-icon-plus'" :size="btnSize" @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog :title="type==='edit'?'编辑账号':'新增账号'" :visible.sync="visible" :close-on-click-modal="false" append-to-body width="600px" @close="reset">

      <el-form ref="form" :rules="rules" :model="form" label-position="right" label-width="140px">
        <el-form-item label="操作员账号：" prop="username">
          <el-input v-model="form.username" placeholder="请输入操作员账号" :disabled="type==='edit'" />
        </el-form-item>
        <el-form-item label="操作员姓名：" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入操作员姓名" />
        </el-form-item>
        <el-form-item v-if="type!=='edit'" label="登录密码：" prop="password">
          <el-input v-model="form.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="操作员角色：" prop="roleIds">
          <role-select v-model="form.roleIds" style="width: 100%;" />
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
import API from '@/api/permission-manager'
import Validate from '@/utils/validate'
import roleSelect from '@/components/RoleSelect'
export default {
  name: 'AddEditOperator',
  components: {
    roleSelect
  },
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
        username: '',
        realName: '',
        password: '',
        mobile: '',
        roleIds: []
      },
      rules: {
        username: [{ required: true, message: '请输入账号' }, Validate.name],
        realName: [{ required: true, message: '请输入姓名' }, Validate.name],
        password: [{ required: true, message: '请输入密码' }, Validate.password],
        roleIds: [{ required: true, message: '请选择角色' }]
      },
      loading: false
    }
  },
  methods: {
    init() {
      if (this.type === 'edit') {
        for (const key in this.form) {
          this.form[key] = this.row[key]
        }
        this.form.roleIds = this.row.roles.map(i => i.id)
        delete this.form.roles
        delete this.form.password
      } else {
        delete this.form.id
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
.add-edit-operator{
  display: inline-block;
  margin-right: 15px;
}
</style>
