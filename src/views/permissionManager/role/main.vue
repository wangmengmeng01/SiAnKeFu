<template>
  <div class="app-container">
    <TablePage
      show-search
      :search-cols="4"
      :search-fields="filterForm"
      :table-cols="tableCols"
      :get-list-fn="getTablePageList"
      :table-access="tablePageTableAccess"
      :refresh="tablePageRefresh"
      :parse-list-fn="parseTablePageList"
      :search-buttons="searchButtons"
      :search-submit-fn="tablePageSearchSubmit"
      @search-change="tablePageSearchChange"
      @page-change="tablePagePageChange"
    />
    <!-- 编辑角色  新增角色 -->
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
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="add2editForm.roleName" placeholder="请输入角色名称" maxlength="10" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-select v-model="add2editForm.status" class="filter-item" placeholder="请选择角色状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <div class="last-form-item">
          <el-button :disabled="add2editSubmiting === 0" @click="resetForm">取消</el-button>
          <el-button :loading="add2editSubmiting === 0" type="primary" @click="submitForm">确认</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="showPrivilegeConfigDialog"
      title="角色授权"
      :close-on-click-modal="false"
      :show-close="savePermissioning !== 0"
      width="500px"
    >
      <div style="padding: 0 0 20px;">角色名称：<strong>{{ currentRoleName }}</strong></div>
      <div
        v-loading="loadingTree === 0"
        class="tree-container"
        element-loading-text="获取角色中..."
      >
        <div v-if="loadingTree !== 0 && loadingTree !== 1" class="element-loading-error">
          <span class="element-loading-error-text">{{ loadingTree }}</span>
          <a class="element-loading-error-retry" href="javascript: void(0);" @click="getTree">点此重试</a>
        </div>
        <el-tree
          v-if="loadingTree === 1"
          ref="tree"
          :data="privilegeTree"
          show-checkbox
          node-key="id"
          :default-expanded-keys="privilegeTreeExpandKeys"
          :default-checked-keys="privilegeTreeCheckedKeys"
          :props="defaultProps"
        />
      </div>
      <div class="last-form-item">
        <el-button
          :disabled="savePermissioning === 0"
          @click="togglePermission"
        >取消</el-button>
        <el-button
          :loading="savePermissioning === 0"
          type="primary"
          @click="savePermission"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import API from '@/api/permission-manager.js'
import TablePageMixin from '@/mixins/table-page'
const LocalForm = {
  roleName: '',
  status: 0
}
export default {
  mixins: [TablePageMixin],
  data() {
    return {
      // getTablePageListName: 'getList',
      searchButtons: [
        { text: '搜索', name: 'submit' },
        { text: '新增角色', name: 'create', action: this.create }
      ],
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '角色名称：',
          name: 'roleName',
          placeholder: '请输入角色名称',
          clearable: true
        }
      ],
      tableCols: [
        { prop: 'roleName', label: '角色名称' },
        { prop: 'createBy', label: '创建人' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'statusText', label: '状态' },
        {
          prop: 'action',
          label: '操作',
          type: 'action',
          actions: [
            {
              text: '编辑',
              name: 'edit',
              action: this.edit,
              plain: true
            },
            {
              text: '授权',
              name: 'auth',
              action: this.auth,
              plain: true
            }
          ]
        }
      ],
      add2edit: 0,
      add2editDialogTitles: ['新增角色', '编辑角色'],
      add2editDialogShow: false,
      add2editForm: {
        ...LocalForm
      },
      add2editRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'change' }]
      },
      // 新增或编辑的提交状态-1|0|1|2
      add2editSubmiting: -1,
      statusOptions: [
        { 'code': 0, 'name': '启用' },
        { 'code': 1, 'name': '停用' }
      ],
      showPrivilegeConfigDialog: false,
      currentRoleName: '',
      loadingTree: 0,
      privilegeTree: [],
      privilegeTreeExpandKeys: [],
      privilegeTreeCheckedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      savePermissioning: -1
    }
  },
  watch: {
    showPrivilegeConfigDialog(v) {
      if (!v) {
        this.$nextTick(() => {
          this.$refs.tree && this.$refs.tree.setCheckedKeys([])
          this.privilegeTreeCheckedKeys = []
        })
      }
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    tablePageTableAccess(name, row) {
      if (Number(row.type) === 0) {
        return false
      }
      return true
    },
    create() {
      this.add2edit = 0
      this.add2editForm = {
        ...LocalForm
      }
      this.$refs.add2editForm && this.$refs.add2editForm.resetFields()
      this.add2editDialogShow = true
    },
    edit(row) {
      this.add2edit = 1
      this.add2editForm = {
        roleName: row.roleName,
        status: row.status,
        id: row.id
      }
      this.add2editDialogShow = true
    },
    auth(row) {
      this.currentRoleName = row.roleName
      this.currentRoleId = row.id
      this.getTree().then(() => {
        this.privilegeTreeCheckedKeys = this.getRowCheckKeys([...row.privilegeTreeCheckedKeys || []])
      })
      this.togglePermission()
    },
    getRowCheckKeys(rowCheckKeys, tree) {
      tree = tree || this.privilegeTree
      return tree.reduce((arr, { id, parentId, children }) => {
        if (arr.indexOf(id) > -1 && arr.indexOf(parentId) > -1) {
          arr.splice(arr.indexOf(parentId), 1)
        }
        if (children && children.length > 0) {
          return this.getRowCheckKeys(arr, children)
        }
        return arr
      }, rowCheckKeys)
    },
    submitForm() {
      if (this.add2editSubmiting === 0) return
      this.$refs.add2editForm.validate(async valid => {
        try {
          if (!valid) return
          this.add2editSubmiting = 0
          const params = {
            ...this.add2editForm
          }
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
      list = (Array.isArray(list) && list) || []
      return list.map(l => ({
        id: l.id,
        roleName: l.roleName,
        status: l.status,
        statusText: l.status === 0 ? '启用' : '停用',
        createTime: l.createTime,
        createBy: l.createBy,
        privilegeTreeCheckedKeys: l.resourceIds,
        type: l.type
      }))
    },
    async savePermission() {
      try {
        const resourceIds = this.getCheckedKeys(this.$refs.tree.getCheckedNodes())
        this.savePermissioning = 0
        await this.$api.auth({
          id: this.currentRoleId,
          resourceIds
        }, {
          // 静默失败，阻止全局请求的错误tip
          quiet: true
        })
        this.$message.success('授权成功')
        setTimeout(() => {
          this.savePermissioning = -1
          this.togglePermission()
          this.updateTablePageListParams({})
        }, 1000)
      } catch (ex) {
        this.savePermissioning = -1
        this.$message.error(ex.message)
        console.log(ex)
      }
    },
    getCheckedKeys(ids) {
      return ids.reduce((idx, { id, parentId }) => {
        if (idx.indexOf(parentId) < 0 && parentId !== 0) {
          idx.push(parentId)
        }
        if (idx.indexOf(id) < 0) {
          idx.push(id)
        }
        return idx
      }, [])
    },
    togglePermission() {
      this.showPrivilegeConfigDialog = !this.showPrivilegeConfigDialog
    },
    async getTree() {
      try {
        this.loadingTree = 0
        if (!this.privilegeTree || !this.privilegeTree.length) {
          const { data: privilegeTree } = await API['/permission-manager/menu'].getList({}, {
            quiet: true
          })
          this.privilegeTree = this.makeTree(privilegeTree)
        }
        this.loadingTree = 1
      } catch (ex) {
        this.loadingTree = ex.message
        console.log(ex)
        return Promise.reject(ex)
      }
    },
    makeTree(data, tree = [], parentId = 0) {
      return data.reduce((pv, p) => {
        const local = {
          id: p.id,
          title: p.title || p.meta.title,
          parentId
        }
        if (p.children && p.children.length) {
          local.children = []
          this.makeTree(p.children, local.children, local.id)
        }
        pv.push(local)
        return pv
      }, tree)
    }
  }
}
</script>

<style lang='scss' scoped>
.tree-container {
  height: 290px;
  overflow: auto;
  .element-loading-error {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
