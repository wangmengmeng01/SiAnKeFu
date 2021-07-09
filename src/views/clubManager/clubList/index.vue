<template>
  <div class="app-container">
    <TablePage
      show-search
      :search-cols="3"
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
      <el-button slot="clubCreateNickname" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.clubCreateUid}})">{{ row.clubCreateNickname }}</el-button>
      <el-button slot="clubCreateSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.clubCreateUid}})">{{ row.clubCreateSaId }}</el-button>
      <el-button slot="clubName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/club-manager/club-detail', query:{ clubId: row.clubId}})">{{ row.clubName }}</el-button>
      <template slot="action" slot-scope="{ row }">
        <el-button type="primary" size="mini" plain @click="putOff(row.saId)">查看任务详情</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/club-manager'
import TablePageMixin from '@/mixins/table-page'

export default {
  name: 'TaskRecord',
  components: {

  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '老板昵称：',
          name: 'clubCreateNickname',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'text',
          value: '',
          label: '老板ID：',
          name: 'clubCreateSaId',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'text',
          value: '',
          label: '老板手机号：',
          name: 'clubCreateMobile',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
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
            width: '130px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '状态：',
          name: 'status',
          dictType: 'club_status',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        },
        {
          type: 'datepicker',
          dateType: 'daterange',
          value: [],
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          label: '创建时间：',
          name: 'clubCreateTime',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        },
        {
          type: 'datepicker',
          dateType: 'daterange',
          value: [],
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          label: '首次激活时间：',
          name: 'firstActiveTime',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'clubName', label: '俱乐部名称', slot: true },
        { prop: 'clubCreateNickname', label: '昵称', slot: true },
        { prop: 'clubCreateSaId', label: 'ID', slot: true },
        { prop: 'clubCreateMobile', label: '手机号' },
        { prop: 'clubCreateDiamondBalance', label: '老板钻石余额' },
        { prop: 'statusName', label: '状态' },
        { prop: 'memberNum', label: '俱乐部人数' },
        { prop: 'clubCreateTime', label: '创建时间' },
        { prop: 'firstActiveTime', label: '首次激活时间' }
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
          if (item.name === 'clubCreateTime') {
            delete this.getTablePageListParams['createTimeBefore']
            delete this.getTablePageListParams['createTimeAfter']
          }
          if (item.name === 'firstActiveTime') {
            delete this.getTablePageListParams['firstActiveTimeBefore']
            delete this.getTablePageListParams['firstActiveTimeAfter']
          }
        } else {
          this.getTablePageListParams[item.name] = item.value
          if (item.name === 'clubCreateTime') {
            this.getTablePageListParams['createTimeBefore'] = item.value[0]
            this.getTablePageListParams['createTimeAfter'] = item.value[1]
            delete this.getTablePageListParams[item.name]
          }
          if (item.name === 'firstActiveTime') {
            this.getTablePageListParams['firstActiveTimeBefore'] = item.value[0]
            this.getTablePageListParams['firstActiveTimeAfter'] = item.value[1]
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
