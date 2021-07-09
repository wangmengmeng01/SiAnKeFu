<template>
  <div class="app-container post-recommendation">
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
      <add-post-recommendation slot="table-header" @success="updateTablePageListParams({})">新增推荐</add-post-recommendation>
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.createBy}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.createBy}})">{{ row.saId }}</el-button>
      <el-button slot="topicContent" slot-scope="{row}" type="text" size="mini" @click="$router.push({path:'/post-manager/topic-detail', query:{ id: row.topicId, content: row.topicContent}})">
        <span v-if="row.topicContent">#</span>
        {{ row.topicContent }}
        <span v-if="row.topicContent">#</span>
      </el-button>
      <template slot="statusName" slot-scope="{ row }">
        <span :class="{'status-on': row.statusName=== '已上架', 'status-off': row.statusName=== '已下架'}">{{ row.statusName }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <preview-post-detail :row="{...row}">预览</preview-post-detail>
        <el-button type="danger" plain size="mini" @click="recommend(row.dynamicId)">取消推荐</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/post-manager'
import TablePageMixin from '@/mixins/table-page'
import addPostRecommendation from './add-post-recommendation'
import previewPostDetail from '../postList/preview-post-detail'

export default {
  name: 'PostRecommendation',
  components: {
    addPostRecommendation, previewPostDetail
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
          label: '用户昵称：',
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
          label: '上架时间：',
          name: 'lastPutTime',
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
          label: '推荐时间：',
          name: 'lastRecommendTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '发布人昵称', slot: true },
        { prop: 'saId', label: '发布人ID', slot: true },
        { prop: 'likeCount', label: '累计点赞数' },
        { prop: 'commentCount', label: '累计评论数' },
        { prop: 'viewCount', label: '累计浏览量' },
        { prop: 'topicContent', label: '话题', slot: true },
        { prop: 'statusName', label: '状态', slot: true },
        { prop: 'lastPutTime', label: '上架时间' },
        { prop: 'lastRecommendTime', label: '最新推荐时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 取消推荐
    recommend(dynamicId, isRecommend = 0) {
      this.$confirm(`确定取消推荐吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].recommend({ dynamicId, isRecommend })
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
