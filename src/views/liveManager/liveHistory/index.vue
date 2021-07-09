<template>
  <div class="app-container live-history">
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
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.userId}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.userId}})">{{ row.saId }}</el-button>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/live-manager'
import TablePageMixin from '@/mixins/table-page'

export default {
  name: 'LiveHistory',
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
          label: '开播时间：',
          name: 'startTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '昵称', slot: true },
        { prop: 'saId', label: 'ID', slot: true },
        { prop: 'startTime', label: '开播时间' },
        { prop: 'endTime', label: '关播时间' },
        { prop: 'liveDuration', label: '直播时长', formatter: (v, r) => (v.liveDuration || '0') },
        { prop: 'audienceNum', label: '观众人数' },
        { prop: 'followNum', label: '新增关注' },
        { prop: 'sendGiftNum', label: '送礼人数' },
        { prop: 'likeNum', label: '收到的赞' },
        { prop: 'coinNum', label: '收获金币' },
        { prop: 'freeCardGiftNum', label: '体验卡礼物数量' },
        { prop: 'clubNewNum', label: '开通俱乐部数' }
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
