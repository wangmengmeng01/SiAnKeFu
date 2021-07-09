<template>
  <div class="app-container topic-list">
    <TablePage
      show-search
      :search-cols="4"
      :search-fields="filterForm"
      :search-buttons="searchButtons"
      :search-submit-fn="tablePageSearchSubmit"
      :table-cols="tableCols"
      :get-list-fn="getTablePageList"
      :get-list-response-keys="{ list: 'list', total: 'total', size: 'pageSize', current: 'pageNum' }"
      :refresh="tablePageRefresh"
      @search-change="tablePageSearchChange"
      @page-change="tablePagePageChange"
    >
      <add-edit-operator slot="table-header" @success="updateTablePageListParams({})">新增账号</add-edit-operator>
      <template slot="status" slot-scope="{ row }">
        <span :class="{'status-on': row.status=== 0, 'status-off': row.status=== 1}">{{ ['启用', '停用'][row.status] }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <add-edit-operator type="edit" btn-size="mini" :row="row" @success="updateTablePageListParams({})">编辑</add-edit-operator>
        <el-button :type="row.status === 1 ? 'success' : 'danger'" size="mini" plain @click="updateStatus(row.id, row.status === 0 ? 1 : 0)">{{ row.status === 0 ? '禁用' : '启用' }}</el-button>
        <el-button type="danger" size="mini" plain @click="resetPassword(row.id)">重置密码</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/permission-manager'
import TablePageMixin from '@/mixins/table-page'
import addEditOperator from './add-eidt-operator'

export default {
  name: 'Operator',
  components: {
    addEditOperator
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '操作员账号：',
          name: 'username',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '120px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'text',
          value: '',
          label: '操作员姓名：',
          name: 'realName',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '120px',
            textAlign: 'right'
          },
          clearable: true
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'username', label: '操作员账号' },
        { prop: 'realName', label: '操作员姓名' },
        { prop: 'roles', label: '操作员角色', formatter: (r, c) => (r[c].map(i => i.roleName).toString()) },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'status', label: '操作员状态', slot: true },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '260px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 启用禁用账户
    updateStatus(id, status) {
      this.$confirm(status === 1 ? `确定要停用该账户？` : `确认要启用该账户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].updateStatus({ id, status })
          this.$message.success('操作成功')
          this.updateTablePageListParams({})
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    },
    // 重置密码
    resetPassword(id, status) {
      this.$confirm(`确定要重置该账户密码？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].resetPassword({ id, status })
          this.$message.success('操作成功')
          this.updateTablePageListParams({})
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
