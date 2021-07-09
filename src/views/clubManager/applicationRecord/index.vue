<template>
  <div class="app-container">
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
      <el-button slot="applyNickname" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.applyUid}})">{{ row.applyNickname }}</el-button>
      <el-button slot="applySaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.applyUid}})">{{ row.applySaId }}</el-button>
      <el-button slot="clubName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/club-manager/club-detail', query:{ clubId: row.clubId}})">{{ row.clubName }}</el-button>
      <template slot="action" slot-scope="{ row }">
        <application-detail :row="{...row}">查看详情</application-detail>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/club-manager'
import TablePageMixin from '@/mixins/table-page'
import applicationDetail from './application-detail'
export default {
  name: 'MoodRecord',
  components: {
    applicationDetail
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '申请者昵称：',
          name: 'applyNickname',
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
          label: '申请者ID：',
          name: 'applySaId',
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
          label: '俱乐部名称：',
          name: 'clubName',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '110px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '状态：',
          name: 'applyStatus',
          dictType: 'club_apply_status',
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
          label: '申请时间：',
          name: 'applyTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'applyNickname', label: '申请者昵称', slot: true },
        { prop: 'applySaId', label: '申请者ID', slot: true },
        { prop: 'clubName', label: '俱乐部', slot: true },
        { prop: 'clubCreateNickname', label: '俱乐部老板' },
        { prop: 'applyStatusName', label: '申请状态' },
        { prop: 'applyTime', label: '申请时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '150px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    tablePageSearchChange({ value, field: { name }}) {
      this.filterForm.forEach(item => {
        // 处理空参数和时间参数的值
        if (item.value === '' || (Array.isArray(item.value) && item.value.length === 0) || item.value === null) {
          delete this.getTablePageListParams[item.name]
          if (item.name === 'createTime') {
            delete this.getTablePageListParams['beforeCreateTime']
            delete this.getTablePageListParams['afterCreateTime']
          }
        } else {
          this.getTablePageListParams[item.name] = item.value
          if (item.name === 'createTime') {
            this.getTablePageListParams['beforeCreateTime'] = item.value[0]
            this.getTablePageListParams['afterCreateTime'] = item.value[1]
            delete this.getTablePageListParams[item.name]
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
