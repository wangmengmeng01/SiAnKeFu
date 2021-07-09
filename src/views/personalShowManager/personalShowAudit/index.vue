<template>
  <div class="app-container personal-show-audit">
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
      <personal-show-cover slot="videoCoverResourceUrl" slot-scope="{row}" :row="row" />
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.saId }}</el-button>
      <template slot="statusName" slot-scope="{ row }">
        <span :class="{'audit-status-yes': row.statusName==='审核通过', 'audit-status-standby': row.statusName==='待审核', 'audit-status-no': row.statusName==='已拒绝'}">{{ row.statusName }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <audit-personal-show :row="{...row}" @success="refreshPage" />
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/personal-show-manager'
import TablePageMixin from '@/mixins/table-page'
import auditPersonalShow from './audit-personal-show'
import personalShowCover from './personal-show-cover'
import multipleAudit from './multiple-audit'

export default {
  name: 'PersonalShowAudit',
  components: { auditPersonalShow, multipleAudit, personalShowCover },
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
          type: 'text',
          value: '',
          label: '手机号：',
          name: 'mobile',
          placeholder: '',
          maxlength: 11,
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
          name: 'status',
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
          label: '上传时间：',
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
        { type: 'selection', width: '100px', fixed: 'left', reserveSelection: false, selectable: (r, i) => (r.status === 0) },
        { prop: 'videoCoverResourceUrl', label: '个人秀视频', slot: true },
        { prop: 'nickName', label: '用户昵称', slot: true },
        { prop: 'saId', label: 'ID', slot: true },
        { prop: 'createTime', label: '上传时间' },
        { prop: 'statusName', label: '状态', slot: true },
        { prop: 'remark', label: '操作理由' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ],
      // 当前选中要操作的项
      multipleSelection: []
    }
  },
  computed: {
    ids() {
      return this.multipleSelection.map(item => item.showId)
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
