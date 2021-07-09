<template>
  <div class="app-container give-out-history">
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
      <add-give-out slot="table-header" @success="updateTablePageListParams({})">平台发放</add-give-out>
      <el-button slot="fromNickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.fromUid}})">{{ row.fromNickName }}</el-button>
      <el-button slot="fromSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.fromUid}})">{{ row.fromSaId }}</el-button>
      <el-button slot="toNickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.toUid}})">{{ row.toNickName }}</el-button>
      <el-button slot="toSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.toUid}})">{{ row.toSaId }}</el-button>
      <template slot="statusName" slot-scope="{ row }">
        <span :class="{'audit-status-yes': row.status===1, 'audit-status-standby': row.status===2, 'audit-status-no': row.status===0}">{{ row.statusName }}</span>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/experience-card-manager'
import TablePageMixin from '@/mixins/table-page'
import addGiveOut from './add-give-out'

export default {
  name: 'GiveOutHistory',
  components: {
    addGiveOut
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '领取者昵称：',
          name: 'toNickName',
          placeholder: '',
          maxlength: 30,
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
          label: '领取者ID：',
          name: 'toSaId',
          placeholder: '',
          maxlength: 10,
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
          label: '发放者昵称：',
          name: 'fromNickName',
          placeholder: '',
          maxlength: 30,
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
          label: '发放者ID：',
          name: 'fromSaId',
          placeholder: '',
          maxlength: 10,
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
          label: '渠道来源：',
          name: 'sourceType',
          dictType: 'identity_exp_transfer_card_source_type',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '状态：',
          name: 'status',
          dictType: 'identity_exp_transfer_card_status',
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
          label: '发放时间：',
          name: 'createTime',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'toNickName', label: '领取者昵称', slot: true },
        { prop: 'toSaId', label: '领取者ID', slot: true },
        { prop: 'fromNickName', label: '发放者昵称', slot: true },
        { prop: 'fromSaId', label: '发放者ID', slot: true },
        { prop: 'statusName', label: '状态', slot: true },
        { prop: 'sourceTypeName', label: '渠道来源' },
        { prop: 'createTime', label: '发放时间', width: '160px' },
        { prop: 'receiveTime', label: '领取激活时间', width: '160px' }
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
