<template>
  <div class="app-container question-answer-detail">

    <el-page-header title="问题列表" :content="`# ${$route.query.question} #`" style="margin-bottom: 15px;" @back="$router.push('/question-answer-manager/question-list')" />

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
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.saId }}</el-button>
      <template slot="status" slot-scope="{ row }">
        <span :class="{'status-on': row.status=== 1, 'status-off': row.status=== 0}">{{ ['已下架', '已上架'][row.status] }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button v-if="row.status===1" type="danger" size="mini" plain @click="deleteAnswer(row)">下架</el-button>
        <preview-detail :answer-id="row.answerId">预览</preview-detail>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/question-answer-manager'
import TablePageMixin from '@/mixins/table-page'
import previewDetail from './preview-detail'

export default {
  name: 'QuestionAnswerDetail',
  components: {
    previewDetail
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
          label: '发布时间：',
          name: 'publishTime',
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
        },
        {
          name: 'questionId',
          value: this.$route.query.id
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '发布人昵称', slot: true },
        { prop: 'saId', label: '发布人ID', slot: true },
        { prop: 'status', label: '状态', slot: true },
        { prop: 'publishTime', label: '发布时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 上架下架标签
    deleteAnswer({ uid, questionId, answerId }) {
      this.$confirm(`下架后不可再上架，是否确定要下架？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].deleteAnswer({ uid, questionId, answerId })
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
