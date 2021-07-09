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
      <el-button slot="giverName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.giverUid}})">{{ row.giverName }}</el-button>
      <el-button slot="giverSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.giverUid}})">{{ row.giverSaId }}</el-button>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/channel-manager'
import TablePageMixin from '@/mixins/table-page'

export default {
  name: 'PayRecord',
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
        { prop: 'giverName', label: '发送者昵称', slot: true },
        { prop: 'giverSaId', label: '发送者ID', slot: true },
        { prop: 'giveTime', label: '发送时间' },
        { prop: 'diamond', label: '消耗钻石' }
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
            delete this.getTablePageListParams[item.name + 'Start']
            delete this.getTablePageListParams[item.name + 'End']
          }
        } else {
          this.getTablePageListParams[item.name] = item.value
          if (item.name === 'giveTime') {
            this.getTablePageListParams[item.name + 'Start'] = item.value[0]
            this.getTablePageListParams[item.name + 'End'] = item.value[1]
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
