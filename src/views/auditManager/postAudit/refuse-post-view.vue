<template>
  <div class="refuse-post-view">

    <!-- button部分 -->
    <el-button :type="btnType" :size="btnSize" @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="已拒绝动态" :visible.sync="visible" :close-on-click-modal="false" top="3vh" width="95%" @close="onReset">

      <TablePage
        v-if="visible"
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
        <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.createBy}})">{{ row.nickName }}</el-button>
        <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.createBy}})">{{ row.saId }}</el-button>
        <template slot="statusName" slot-scope="{ row }">
          <span class="audit-status-no">{{ row.statusName }}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <preview-post-detail :row="{...row}">预览</preview-post-detail>
          <el-button type="success" plain size="mini" @click="audit(row.dynamicId)">重新通过</el-button>
        </template>
      </TablePage>

    </el-dialog>

  </div>
</template>

<script>
import API from '@/api/audit-manager'
import TablePageMixin from '@/mixins/table-page'
import previewPostDetail from '@/views/postManager/postList/preview-post-detail'
export default {
  name: 'RefusePostView',
  components: {
    previewPostDetail
  },
  mixins: [TablePageMixin],
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      visible: false,
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
        }
      ],
      // 查询函数名
      getTablePageListName: 'getRefuseList',
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '发布人昵称', slot: true },
        { prop: 'saId', label: '发布人ID', slot: true },
        { prop: 'createTime', label: '发布时间' },
        { prop: 'statusName', label: '状态', slot: true },
        { prop: 'auditRemark', label: '拒绝原因' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    init() {
      this.visible = true
    },
    // 重新通过
    audit(dynamicId, logic = 1) {
      this.$confirm(`确定要重新通过该动态吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].audit({ dynamicId, logic })
          this.updateTablePageListParams({})
          this.$emit('success')
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
