<template>
  <div class="app-container live-permission-audit">
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
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.saId }}</el-button>
      <template slot="auditStatusName" slot-scope="{ row }">
        <span :class="{'audit-status-yes': row.auditStatusName==='审核通过', 'audit-status-standby': row.auditStatusName==='待审核', 'audit-status-no': row.auditStatusName==='已拒绝'}">{{ row.auditStatusName }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <audit-live-permission :row="{...row}" @success="updateTablePageListParams({})" />
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/audit-manager'
import TablePageMixin from '@/mixins/table-page'
import auditLivePermission from './audit-live-permission'

export default {
  name: 'LivePermissionAudit',
  components: { auditLivePermission },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '昵称：',
          name: 'nickName',
          placeholder: '',
          maxlength: 30,
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'text',
          value: '',
          label: 'ID：',
          name: 'saId',
          placeholder: '',
          maxlength: 10,
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '状态：',
          name: 'auditStatus',
          dictType: 'common_audit_status',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        },
        {
          type: 'datepicker',
          dateType: 'daterange',
          value: [],
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          label: '提交时间：',
          name: 'createTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '用户昵称', slot: true },
        { prop: 'saId', label: '用户ID', slot: true },
        { prop: 'mobile', label: '手机号' },
        { prop: 'realName', label: '姓名' },
        { prop: 'createTime', label: '提交时间' },
        { prop: 'auditStatusName', label: '状态', slot: 'true' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

</style>
