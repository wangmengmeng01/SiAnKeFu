<template>
  <div class="app-container follow-recommendation">
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
      <add-follow-recommendation slot="table-header" @success="updateTablePageListParams({})">新增推荐</add-follow-recommendation>
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.saId }}</el-button>
      <template slot="action" slot-scope="{ row }">
        <el-button type="danger" size="mini" plain @click="recommend(row.saId)">取消推荐</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/post-manager'
import TablePageMixin from '@/mixins/table-page'
import addFollowRecommendation from './add-follow-recommendation'

export default {
  name: 'FollowRecommendation',
  components: {
    addFollowRecommendation
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
        // {
        //   type: 'text',
        //   value: '',
        //   label: '手机号：',
        //   name: 'mobile',
        //   placeholder: '',
        //   labelStyle: {
        //     display: 'inline-block',
        //     width: '100px',
        //     textAlign: 'right'
        //   },
        //   clearable: true
        // }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '用户昵称', slot: true },
        { prop: 'saId', label: 'ID', slot: true },
        // { prop: 'mobile', label: '手机号' },
        { prop: 'realName', label: '真实姓名' },
        { prop: 'followCount', label: '粉丝数' },
        { prop: 'lastRecommendTime', label: '最新加入时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '160px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 取消推荐
    recommend(saId, logic = 0) {
      this.$confirm(`确定取消推荐吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].recommend({ saId, logic })
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
