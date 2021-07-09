<template>
  <div class="app-container topic-list">
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
      <add-edit-topic slot="table-header" @success="updateTablePageListParams({})">创建话题</add-edit-topic>
      <template slot="status" slot-scope="{ row }">
        <span :class="{'status-on': row.status=== 1, 'status-off': row.status=== 0}">{{ ['已下架', '已上架'][row.status] }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <add-edit-topic type="edit" btn-size="mini" :row="row" @success="updateTablePageListParams({})">编辑</add-edit-topic>
        <el-button :type="row.status === 0 ? 'success' : 'danger'" size="mini" plain @click="putOff(row.topicId, row.status === 0 ? 1 : 0)">{{ row.status === 0 ? '上架' : '下架' }}</el-button>
        <el-button type="primary" size="mini" plain @click="$router.push({path:'/post-manager/topic-detail', query:{ id: row.topicId, content: row.content}})">查看</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/post-manager'
import TablePageMixin from '@/mixins/table-page'
import addEditTopic from './add-eidt-topic'

export default {
  name: 'TopicList',
  components: {
    addEditTopic
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '话题名称：',
          name: 'content',
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
          type: 'select',
          value: -1,
          label: '状态：',
          name: 'status',
          options: [
            { value: -1, label: '全部' },
            { value: 1, label: '已上架' },
            { value: 0, label: '已下架' }
          ],
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'content', label: '话题名称' },
        { prop: 'relativeCount', label: '累计相关动态数' },
        { prop: 'likeCount', label: '累计点赞数' },
        { prop: 'commentCount', label: '累计评论数' },
        { prop: 'hotPoint', label: '话题热度' },
        { prop: 'viewCount', label: '话题浏览次数' },
        { prop: 'participateCount', label: '话题参与人数' },
        { prop: 'status', label: '状态', slot: true },
        { prop: 'lastPutTime', label: '最新上架时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '260px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 上架下架话题
    putOff(topicId, logic) {
      this.$confirm(logic === 0 ? `确定要下架该话题吗？` : `确认要上架该话题吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].putOff({ topicId, logic })
          this.$message.success('操作成功')
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
