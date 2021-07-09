<template>
  <div ref="permission_menu_page" class="app-container">
    <TablePage
      :show-search="false"
      :show-page="false"
      :table-cols="tableCols"
      :get-list-fn="getTablePageList"
      :table-access="tablePageTableAccess"
      :refresh="tablePageRefresh"
      :parse-list-fn="parseTablePageList"
      table-row-key="id"
    >
      <el-button slot="table-header" type="primary" size="small" style="width: 100px;" @click="create">新增菜单</el-button>
    </TablePage>
    <el-dialog
      :title="add2editDialogTitles[add2edit]"
      :visible.sync="add2editDialogShow"
      :close-on-click-modal="false"
      :show-close="add2editSubmiting !== 0"
      width="500px"
    >
      <el-form
        ref="add2editForm"
        :rules="add2editRules"
        :model="add2editForm"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="菜单类型">
          <el-radio-group
            v-model="add2editForm.type"
            :disabled="!!add2edit"
            size="small"
          >
            <el-radio-button :label="0">目录</el-radio-button>
            <el-radio-button :label="1">菜单</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="add2editForm.icon" />
        </el-form-item>
        <el-form-item label="菜单标题" prop="title">
          <el-input v-model="add2editForm.title" />
        </el-form-item>
        <el-form-item label="路由地址" prop="path">
          <el-input v-model="add2editForm.path" />
        </el-form-item>
        <!-- <el-form-item label="组件名称" prop="name">
          <el-input v-model="add2editForm.name" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="add2editForm.component" />
        </el-form-item> -->
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="add2editForm.sort" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否隐藏">
          <el-radio-group v-model="add2editForm.hidden" size="small">
            <el-radio-button :label="1">是</el-radio-button>
            <el-radio-button :label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="add2editForm.type !== 0 && add2editForm.parentId !== 0" label="上级类目" prop="parentId">
          <el-cascader
            v-model="add2editForm.parentId"
            :options="menus"
            :show-all-levels="false"
            :props="{ checkStrictly: true, value: 'id', label: 'title' }"
          />
        </el-form-item>
        <div class="last-form-item">
          <el-button :disabled="add2editSubmiting === 0" @click="resetForm">取消</el-button>
          <el-button :loading="add2editSubmiting === 0" type="primary" @click="submitForm">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/permission-manager'
import TablePageMixin from '@/mixins/table-page'
const LocalForm = {
  type: 0,
  icon: '',
  title: '',
  path: '',
  name: '',
  component: '',
  sort: 0,
  hidden: 0,
  parentId: ''
}
export default {
  mixins: [TablePageMixin],
  data() {
    return {
      tableCols: [
        { label: '菜单名称', prop: 'title' },
        { label: '菜单图标', prop: 'icon' },
        { label: '排序', prop: 'sort' },
        { label: '路由地址', prop: 'path' },
        { label: '权限标识', prop: 'permission' },
        { label: '组件路径', prop: 'component' },
        {
          label: '操作', prop: 'action', type: 'action', fixed: 'right', width: '150px',
          actions: [
            { text: '编辑', action: this.edit, plain: true },
            { text: '删除', action: this.remove, plain: true, type: 'danger' }
          ]
        }
      ],
      // 编辑态为1
      add2edit: 0,
      // 弹框标题
      add2editDialogTitles: ['新增菜单', '编辑菜单'],
      // 是否显示弹框
      add2editDialogShow: false,
      // 新增或编辑的提交状态-1|0|1|2
      add2editSubmiting: -1,
      // 菜单列表
      menus: [],
      // 单项数据
      add2editForm: { ...LocalForm },
      add2editRules: {
        title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
        path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
        // name: [{ required: true, message: '请输入组件名称', trigger: 'blur' }],
        // component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择上级类目', trigger: 'blur' }]
      }
    }
  },
  watch: {
    add2editDialogShow(v) {
      if (!v) {
        this.$refs.add2editForm.resetFields()
      }
    }/* ,
    'add2editForm.type': function(v) {
      if (v === 0) {
        this.add2editForm.parentId = 0
      } else {
        this.add2editForm.parentId = ''
      }
    } */
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    create() {
      this.add2edit = 0
      this.add2editForm = { ...LocalForm }
      this.menus = JSON.parse(JSON.stringify(this.copyMenus))
      this.add2editDialogShow = true
    },
    edit(row) {
      this.add2edit = 1
      this.menus = this.disableCurrentMenu(JSON.parse(JSON.stringify(this.copyMenus)), row.id)
      this.add2editForm = Object.keys(LocalForm).reduce((form, k) => {
        form[k] = row[k]
        return form
      }, {})
      this.add2editForm.parentId = row.type === 0 ? 0 : row.parentId
      this.add2editForm.id = row.id
      this.add2editDialogShow = true
    },
    disableCurrentMenu(menus, id) {
      for (let i = 0, len = menus.length; i < len; i++) {
        if (menus[i].id === id) {
          menus[i].disabled = true
          break
        } else if (menus[i].children && menus[i].children.length) {
          this.disableCurrentMenu(menus[i].children, id)
        }
      }
      return menus
    },
    async remove({ id, title }) {
      let loading
      try {
        await this.$confirm('确定要删除‘' + title + '’该项菜单吗？')
        loading = this.$loading({
          target: this.$refs.permission_menu_page
        })
        await this.$api.remove({ id })
        this.$message.success('删除成功')
        this.updateTablePageListParams({})
      } catch (ex) {
        console.log(ex)
      }
      loading && loading.close()
    },
    submitForm() {
      if (this.add2editSubmiting === 0) return
      this.$refs.add2editForm.validate(async valid => {
        try {
          if (!valid) return
          this.add2editSubmiting = 0
          const params = {
            ...this.add2editForm,
            name: '',
            component: '',
            alwaysShow: 0,
            redirect: ''
          }
          params.parentId = Array.isArray(params.parentId) ? params.parentId.slice(-1)[0] : params.type === 0 ? 0 : params.parentId
          await this.$api[this.add2edit ? 'update' : 'create'](params)
          this.$message.success((this.add2edit ? '编辑' : '创建') + '成功')
          setTimeout(() => {
            this.resetForm()
            this.updateTablePageListParams({})
          }, 1000)
        } catch (ex) {
          this.add2editSubmiting = -1
          this.$message.error(ex.message)
          console.log(ex)
        }
      })
    },
    resetForm() {
      this.add2editSubmiting = -1
      this.$refs.add2editForm.resetFields()
      this.add2editDialogShow = !this.add2editDialogShow
    },
    parseTablePageList(list = []) {
      this.$store.commit('user/SET_MENUS', list)
      this.copyMenus = this.parseList(list)
      const MENUS = JSON.stringify(this.copyMenus)
      this.menus = JSON.parse(MENUS)
      return JSON.parse(MENUS)
    },
    parseList(list = []) {
      list = (Array.isArray(list) && list) || []
      const result = list.map(l => {
        const local = {
          id: l.id,
          type: l.type,
          icon: l.meta.icon,
          title: l.meta.title,
          path: l.path,
          sort: l.sort,
          hidden: l.hidden ? 1 : 0,
          parentId: l.parentId,
          permission: l.permission,
          isMerchantShow: l.isMerchantShow,
          typeText: l.type === 0 ? '目录' : l.type === 1 ? '菜单' : '按钮',
          __remove: {
            loading: false
          }
        }
        if (l.children && l.children.length) {
          local.children = this.parseList(l.children)
        }
        return local
      })
      return result
    }
  }
}
</script>

<style lang='scss' scoped>
.table-page-container {
  ::v-deep {
    .filter-form-container {
      margin-bottom: 20px;
    }
  }
}
</style>
