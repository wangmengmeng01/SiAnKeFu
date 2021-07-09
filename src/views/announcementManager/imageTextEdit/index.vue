<template>
  <div class="app-container image-text-edit">
    <TablePage
      :show-search="false"
      :table-cols="tableCols"
      :get-list-fn="getTablePageList"
      :get-list-response-keys="{ list: 'list', total: 'total', size: 'pageSize', current: 'pageNum' }"
      :refresh="tablePageRefresh"
      @page-change="tablePagePageChange"
    >
      <add-edit-dialog slot="table-header" @success="updateTablePageListParams({})">新增</add-edit-dialog>
      <template slot="link" slot-scope="{ row }">
        <el-button v-clipboard="getCopyUrl(row.id)" v-clipboard:success="copySuccess" v-clipboard:error="copyError" type="text" size="mini" icon="el-icon-copy-document">复制链接</el-button>
      </template>
      <template slot="action" slot-scope="{ row }">
        <add-edit-dialog :row="{...row}" type="edit" btn-size="mini" @success="updateTablePageListParams({})">编辑</add-edit-dialog>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/announcement-manager'
import TablePageMixin from '@/mixins/table-page'
import addEditDialog from './add-edit-dialog'

export default {
  name: 'ImageTextEdit',
  components: {
    addEditDialog
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // table列字段集合
      tableCols: [
        { prop: 'title', label: '备注' },
        { prop: 'link', label: '链接', slot: true, width: '120px' },
        { prop: 'updateTime', label: '最新编辑时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '100px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    copySuccess() {
      this.$message.success('复制成功')
    },
    copyError() {
      this.$message.error('复制失败')
    },
    getCopyUrl(id) {
      let mode = process.env.NODE_ENV
      if (process.env.VUE_APP_TITLE.includes('预演')) {
        mode = 'pre'
      }
      const obj = {
        'development': `https://h5-dev.sian.vip/announcement?id=${id}`,
        'test': `https://h5-test.sian.vip/announcement?id=${id}`,
        'pre': `https://h5-pre.sian.vip/agreement`,
        'production': `https://h5-pro.sian.vip/announcement?id=${id}`
      }
      return obj[mode]
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
