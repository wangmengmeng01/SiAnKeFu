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
      <el-button slot="giverNickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.giverUid}})">{{ row.giverNickName }}</el-button>
      <el-button slot="giverSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.giverUid}})">{{ row.giverSaId }}</el-button>
      <el-button slot="clubName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/club-manager/club-detail', query:{ clubId: row.clubId}})">{{ row.clubName }}</el-button>
      <template slot="action" slot-scope="{ row }">
        <redpacket-detail :row="{...row}">查看详情</redpacket-detail>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/club-manager'
import TablePageMixin from '@/mixins/table-page'
import redpacketDetail from './redpacket-detail'

export default {
  name: 'MoodRecord',
  components: {
    redpacketDetail
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '发送者昵称：',
          name: 'giverNickName',
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
          label: '发送者ID：',
          name: 'giverSaId',
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
          type: 'select',
          value: -1,
          label: '红包类型：',
          name: 'redPacketType',
          options: [
            { value: -1, label: '全部' },
            { value: 1, label: '每日红包' },
            { value: 0, label: '普通红包' }
          ],
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
          label: '发送时间：',
          name: 'giveTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'giverNickName', label: '发送者昵称', slot: true },
        { prop: 'giverSaId', label: '发送者ID', slot: true },
        { prop: 'clubName', label: '俱乐部', slot: true },
        { prop: 'clubBossName', label: '俱乐部老板' },
        { prop: 'redPacketType', label: '红包类型' },
        { prop: 'giveTime', label: '发送时间' },
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
          if (item.name === 'giveTime') {
            delete this.getTablePageListParams['giveTimeStart']
            delete this.getTablePageListParams['giveTimeEnd']
          }
        } else {
          this.getTablePageListParams[item.name] = item.value
          if (item.name === 'giveTime') {
            this.getTablePageListParams['giveTimeStart'] = item.value[0]
            this.getTablePageListParams['giveTimeEnd'] = item.value[1]
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
