<template>
  <div class="app-container live-recommendation">
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
      <add-live-recommendation slot="table-header" @success="updateTablePageListParams({})">新增推荐</add-live-recommendation>
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.userId}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.userId}})">{{ row.saId }}</el-button>
      <template slot="action" slot-scope="{ row }">
        <el-button type="danger" plain size="mini" @click="remove(row.id)">取消推荐</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/live-manager'
import TablePageMixin from '@/mixins/table-page'
import addLiveRecommendation from './add-live-recommendation'

export default {
  name: 'LiveRecommendation',
  components: {
    addLiveRecommendation
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
          type: 'text',
          value: '',
          label: '手机号：',
          name: 'mobile',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          },
          clearable: true
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '用户昵称', slot: true },
        { prop: 'saId', label: 'ID', slot: true },
        { prop: 'mobile', label: '手机号' },
        { prop: 'realName', label: '真实姓名' },
        { prop: 'liveCount', label: '直播次数' },
        { prop: 'updateTime', label: '最新加入时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 取消推荐
    remove(id) {
      this.$confirm(`确定取消推荐吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].remove({ id })
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
