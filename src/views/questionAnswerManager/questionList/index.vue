<template>
  <div class="app-container question-list">
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
      <add-question slot="table-header" @success="updateTablePageListParams({})">新增问题</add-question>
      <template slot="status" slot-scope="{ row }">
        <span :class="{'status-on': row.status=== 1, 'status-off': row.status=== 0}">{{ ['已下架', '已上架'][row.status] }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button :type="row.status === 0 ? 'success' : 'danger'" size="mini" plain @click="putOff(row.id, row.status === 0 ? 1 : 0)">{{ row.status === 0 ? '上架' : '下架' }}</el-button>
        <el-button type="primary" size="mini" plain @click="$router.push({path:'/question-answer-manager/question-answer-detail', query:{ id: row.id, question: row.question }})">查看</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/question-answer-manager'
import TablePageMixin from '@/mixins/table-page'
import addQuestion from './add-question'

export default {
  name: 'QuestionList',
  components: {
    addQuestion
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '问题：',
          name: 'question',
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
          name: 'putTime',
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
        { prop: 'question', label: '问题' },
        { prop: 'answerCount', label: '作答人数' },
        { prop: 'status', label: '状态', slot: true },
        { prop: 'lastPutTime', label: '最新上架时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 上架下架标签
    putOff(id, status) {
      this.$confirm(status === 0 ? `确定要下架该问题吗？` : `确认要上架该问题吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].putOff({ id, status })
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
