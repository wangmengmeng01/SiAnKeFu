<template>
  <div class="app-container accost">
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
      <add-text slot="table-header" @success="updateTablePageListParams({})">新增文案</add-text>
      <template slot="status" slot-scope="{ row }">
        <span :class="{'status-on': row.status=== 1, 'status-off': row.status=== 0}">{{ ['已下架', '已上架'][row.status] }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button :type="row.status === 0 ? 'success' : 'danger'" size="mini" plain @click="putOff(row.id, row.status === 0 ? 1 : 0)">{{ row.status === 0 ? '上架' : '下架' }}</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/common-manager'
import TablePageMixin from '@/mixins/table-page'
import addText from './addText'

export default {
  name: 'Accost',
  components: {
    addText
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
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
            width: '90px',
            textAlign: 'right'
          }
        },
        {
          value: 2,
          name: 'type'
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'content', label: '文案内容' },
        { prop: 'status', label: '状态', slot: true },
        { prop: 'lastPutTime', label: '最新上架时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '100px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 上架下架标签
    putOff(id, status) {
      this.$confirm(status === 0 ? `确定要下架该文案吗？` : `确认要上架该文案吗？`, '提示', {
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
