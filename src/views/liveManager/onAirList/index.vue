<template>
  <div class="app-container on-air-list">
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
      <template slot="action" slot-scope="{ row }">
        <preview-live :id="row.liveRoomId">预览直播</preview-live>
        <el-button type="danger" plain size="mini" style="color: red;" @click="offLive(row.liveRoomId, row.id)">断流</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/live-manager'
import TablePageMixin from '@/mixins/table-page'
import previewLive from './preview-live'

export default {
  name: 'OnAirList',
  components: {
    previewLive
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
            width: '80px',
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
            width: '80px',
            textAlign: 'right'
          },
          clearable: true
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '昵称', slot: true },
        { prop: 'saId', label: 'ID', slot: true },
        { prop: 'startTime', label: '开播时间' },
        { prop: 'audienceNum', label: '当前观众人数' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 断流
    offLive(liveRoomId, liveBroadcastId) {
      this.$confirm(`确认要断流该直播间吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].offLive({ liveRoomId, liveBroadcastId })
          this.updateTablePageListParams({})
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
