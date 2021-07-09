<template>
  <div class="app-container post-audit">
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
      <refuse-post-view slot="table-header" @success="updateTablePageListParams({})">查看已拒绝动态</refuse-post-view>
      <template slot="preview" slot-scope="{ row }">
        <table-post-col :row="{...row}" />
      </template>
      <template slot="action" slot-scope="{ row }">
        <audit-post-col :row="{...row}" @success="updateTablePageListParams({})" />
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/audit-manager'
import TablePageMixin from '@/mixins/table-page'
import refusePostView from './refuse-post-view'
import auditPostCol from './audit-post'
import tablePostCol from './table-post-col'

export default {
  name: 'PostAudit',
  components: {
    tablePostCol, auditPostCol, refusePostView
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: 'ID：',
          name: 'saId',
          placeholder: '',
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
          label: '昵称：',
          name: 'nickName',
          placeholder: '',
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
          label: '发布时间：',
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
        { prop: 'preview', label: '动态预览', slot: true },
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
