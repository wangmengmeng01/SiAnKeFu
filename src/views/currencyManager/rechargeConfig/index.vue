<template>
  <div class="app-container recharge-config">
    <TablePage
      :show-search="false"
      :show-page="false"
      :table-cols="tableCols"
      :get-list-fn="getTablePageList"
      :get-list-response-keys="{ list: 'list', total: 'total', size: 'pageSize', current: 'pageNum' }"
      :refresh="tablePageRefresh"
    >
      <add-edit-recharge slot="table-header" @success="updateTablePageListParams({})">新增选项</add-edit-recharge>
      <template slot="status" slot-scope="{ row }">
        <span :class="{'status-on': row.status=== 1, 'status-off': row.status=== 0}">{{ ['已下架', '已上架'][row.status] }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <!-- <add-edit-recharge type="edit" btnSize="mini" :row="{...row}" @success="updateTablePageListParams({})">编辑</add-edit-recharge> -->
        <el-button :type="row.status === 0 ? 'success' : 'danger'" size="mini" plain @click="putOff(row.id, row.status === 0 ? 1 : 0)">{{ row.status === 0 ? '上架' : '下架' }}</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/currency-manager'
import TablePageMixin from '@/mixins/table-page'
import addEditRecharge from './add-edit-recharge'

export default {
  name: 'RechargeConfig',
  components: {
    addEditRecharge
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // table列字段集合
      tableCols: [
        { prop: 'sortNo', label: '序号' },
        { prop: 'money', label: '人民币金额(元)' },
        { prop: 'diamondAmount', label: '钻石数量' },
        { prop: 'status', label: '状态', slot: true },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 上架下架标签
    putOff(id, logic) {
      this.$confirm(logic === 0 ? `确定要下架吗？` : `确认要上架吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].putOff({ id, logic })
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
