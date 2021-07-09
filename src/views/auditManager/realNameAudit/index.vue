<template>
  <div class="app-container real-name-audit">
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
      <el-image slot="idCardFront" slot-scope="{row}" style="width: 40px; height: 40px" :src="row.idCardFront" :preview-src-list="[row.idCardFront]" />
      <el-image slot="idCardBack" slot-scope="{row}" style="width: 40px; height: 40px" :src="row.idCardBack" :preview-src-list="[row.idCardBack]" />
      <el-image slot="idCardHand" slot-scope="{row}" style="width: 40px; height: 40px" :src="row.idCardHand" :preview-src-list="[row.idCardHand]" />
      <template slot="auditStatus" slot-scope="{ row }">
        <span :class="{'audit-status-yes': row.auditStatus===1, 'audit-status-standby': row.auditStatusName===0, 'audit-status-no': row.auditStatusName===2}">{{ ['待审核', '已通过', '已拒绝'][row.auditStatus] }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <audit-real-name :row="{...row}" @success="updateTablePageListParams({})" />
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/audit-manager'
import TablePageMixin from '@/mixins/table-page'
import auditRealName from './audit-real-name'

export default {
  name: 'RealNameAudit',
  components: { auditRealName },
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
            width: '100px',
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
            width: '100px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '状态：',
          name: 'auditStatus',
          dictType: 'common_audit_status',
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
          label: '提交时间：',
          name: 'createTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '用户昵称', slot: true },
        { prop: 'saId', label: '用户ID', slot: true },
        { prop: 'mobile', label: '手机号' },
        { prop: 'realName', label: '姓名' },
        { prop: 'idCard', label: '身份证号' },
        { prop: 'idCardFront', label: '证件照正面', slot: true },
        { prop: 'idCardBack', label: '证件照反面', slot: true },
        { prop: 'idCardHand', label: '手持证件照', slot: true },
        { prop: 'createTime', label: '提交时间' },
        { prop: 'auditStatus', label: '状态', slot: true },
        { prop: 'auditRemark', label: '操作理由' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '240px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

</style>
