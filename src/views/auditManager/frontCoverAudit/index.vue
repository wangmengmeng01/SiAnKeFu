<template>
  <div class="app-container front-cover-audit">
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
      :table-select-change="(val)=> (multipleSelection = val)"
      table-ref-key="frontCoverTable"
      table-row-key="id"
      @search-change="tablePageSearchChange"
      @page-change="tablePagePageChange"
    >
      <multiple-audit slot="table-header" :ids="ids" @success="refreshPage" />
      <el-image slot="url" slot-scope="{row}" style="width: 40px; height: 40px" :src="row.url" :preview-src-list="[row.url]" />
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.userId}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.userId}})">{{ row.saId }}</el-button>
      <template slot="auditStatusName" slot-scope="{ row }">
        <span :class="{'audit-status-yes': row.auditStatusName==='审核通过', 'audit-status-standby': row.auditStatusName==='待审核', 'audit-status-no': row.auditStatusName==='已拒绝'}">{{ row.auditStatusName }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <audit-front-cover :row="{...row}" @success="refreshPage" />
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/audit-manager'
import TablePageMixin from '@/mixins/table-page'
import auditFrontCover from './audit-front-cover'
import multipleAudit from './multiple-audit'

export default {
  name: 'FrontCoverAudit',
  components: { auditFrontCover, multipleAudit },
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
          type: 'datepicker',
          dateType: 'daterange',
          value: [],
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          label: '上传时间：',
          name: 'createTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
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
        }
      ],
      // table列字段集合
      tableCols: [
        { type: 'selection', width: '100px', fixed: 'left', reserveSelection: false, selectable: (r, i) => (r.auditStatus === 0) },
        { prop: 'url', label: '封面图', slot: true },
        { prop: 'nickName', label: '用户昵称', slot: true },
        { prop: 'saId', label: 'ID', slot: true },
        { prop: 'createTime', label: '上传时间' },
        { prop: 'auditStatusName', label: '状态', slot: true },
        { prop: 'auditRemark', label: '操作理由' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ],
      // 当前选中要操作的项
      multipleSelection: []
    }
  },
  computed: {
    ids() {
      return this.multipleSelection.map(item => item.id)
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    refreshPage() {
      this.updateTablePageListParams({})
      // this.$refs.frontCoverTable.clearSelection()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
