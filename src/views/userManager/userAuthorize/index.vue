<template>
  <div class="app-container user-authorize">
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
      <add-authorize slot="table-header" @success="updateTablePageListParams({})">新增授权</add-authorize>
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.saId }}</el-button>
      <template slot="action" slot-scope="{ row }">
        <el-button type="danger" plain size="mini" @click="cancelAuthIdentity(row.uid)">取消授权</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import TablePageMixin from '@/mixins/table-page'
import addAuthorize from './addAuthorize'

export default {
  name: 'UserAuthorize',
  components: {
    addAuthorize
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '昵称：',
          name: 'nickName',
          placeholder: '',
          maxlength: 30,
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'text',
          value: '',
          label: 'ID：',
          name: 'saId',
          placeholder: '',
          maxlength: 10,
          labelStyle: {
            display: 'inline-block',
            width: '130px',
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
          maxlength: 11,
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          },
          clearable: true
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '昵称', slot: true },
        { prop: 'saId', label: 'ID', slot: true },
        { prop: 'mobile', label: '手机号' },
        { prop: 'authTime', label: '授权时间', width: '160px' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 取消授权
    cancelAuthIdentity(uid) {
      this.$confirm(`取消后该用户将不再拥有二重世界身份。确定取消授权吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].cancelAuthIdentity({ uid })
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
