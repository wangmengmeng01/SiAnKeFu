<template>
  <div class="app-container version-update">
    <TablePage
      :show-search="false"
      :show-page="false"
      :table-cols="tableCols"
      :get-list-fn="getTablePageList"
      :get-list-response-keys="{ list: 'list', total: 'total', size: 'pageSize', current: 'pageNum' }"
      :refresh="tablePageRefresh"
    >
      <template slot="link" slot-scope="{ row }">
        <!-- <el-button v-clipboard="getCopyUrl(row.type)" v-clipboard:success="copySuccess" v-clipboard:error="copyError" type="text" size="mini" icon="el-icon-copy-document">复制链接</el-button> -->
        <el-button v-clipboard="row.linkUrl" v-clipboard:success="copySuccess" v-clipboard:error="copyError" type="text" size="mini" icon="el-icon-copy-document">复制链接</el-button>
      </template>
      <template slot="action" slot-scope="{ row }">
        <edit-agreement :row="{...row}" @success="updateTablePageListParams({})">编辑</edit-agreement>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/common-manager'
import TablePageMixin from '@/mixins/table-page'
import editAgreement from './edit-agreement'

export default {
  name: 'Agreement',
  components: {
    editAgreement
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // table列字段集合
      tableCols: [
        { prop: 'type', label: '协议标识', formatter: (r, c) => (['', '用户协议', '关于', '直播协议', '隐私协议'][Number(r[c])]) },
        { prop: 'name', label: '协议名称' },
        { prop: 'link', label: '链接', slot: true },
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
    getCopyUrl(type) {
      let mode = process.env.NODE_ENV
      if (process.env.VUE_APP_TITLE.includes('预演')) {
        mode = 'pre'
      }
      const obj = {
        'development': `https://h5-dev.sian.vip/agreement?type=${type}`,
        'test': `https://h5-test.sian.vip/agreement?type=${type}`,
        'pre': `https://h5-pre.sian.vip/agreement?type=${type}`,
        'production': `https://h5-pro.sian.vip/agreement?type=${type}`
      }
      return obj[mode]
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
