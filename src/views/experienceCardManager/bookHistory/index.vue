<template>
  <div class="app-container book-history">
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
      <template slot="statusName" slot-scope="{ row }">
        <span :class="{'audit-status-yes': row.status===1, 'audit-status-standby': row.status===0, 'audit-status-no': row.status===2}">{{ row.statusName }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button v-if="row.status===0" type="danger" size="mini" plain @click="reject(row)">拒绝</el-button>
        <el-button v-if="row.status===0" type="success" size="mini" plain @click="audit(row.appointmentId, 1)">发放</el-button>
        <el-button v-if="[1, 2].includes(row.status)" type="default" size="mini" plain disabled>已操作</el-button>
      </template>
    </TablePage>
    <dialog-content
      :visible.sync="rejectionTemp.visible"
      :before-ok="handleReject"
      :before-cancel="reset"
      show-close
      show-ok
      ok-label="拒绝"
      title="提示"
      width="500px"
    >
      <el-form ref="form" :rules="rules" :model="rejectionTemp">
        <el-form-item prop="remark">
          <el-input v-model="rejectionTemp.remark" placeholder="请输入拒绝给该用户发放体验卡的理由..." type="textarea" :autosize="{ minRows: 6, maxRows: 10 }" />
        </el-form-item>
      </el-form>
    </dialog-content>
  </div>
</template>

<script>

import API from '@/api/experience-card-manager'
import TablePageMixin from '@/mixins/table-page'

export default {
  name: 'BookHistory',
  components: {
    DialogContent: () => import('@/components/Cell/Dialog')
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
          type: 'text',
          value: '',
          label: '手机号：',
          name: 'mobile',
          placeholder: '',
          maxlength: 11,
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
          name: 'status',
          dictType: 'identity_exp_appointment_card_status',
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
          label: '预约时间：',
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
        { prop: 'diamondNumber', label: '钻石余额' },
        { prop: 'statusName', label: '状态', slot: true },
        { prop: 'createTime', label: '申请预约时间', width: '160px' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '240px' }
      ],
      rejectionTemp: {
        visible: false,
        loading: false,
        rejectionTemp: undefined,
        remark: ''
      },
      rules: {
        remark: [{ required: true, message: '请输入拒绝理由' }]
      }
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    audit(appointmentId, action) {
      this.$confirm(action === 1 ? '确定给该用户发放体验卡吗？' : '确定拒绝给该用户发放体验卡吗？', '提示', {
        confirmButtonText: action === 1 ? '确定发放' : '确定拒绝',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].audit({ appointmentId, action })
          this.$message.success('操作成功')
          this.updateTablePageListParams({})
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    },
    reject(row) {
      this.rejectionTemp.visible = true
      this.rejectionTemp.appointmentId = row.appointmentId
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleReject() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm('确定拒绝给该用户发放体验卡吗？', '提示', {
            confirmButtonText: '确定拒绝',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async() => {
            try {
              await API[this.$route.path].audit({ appointmentId: this.rejectionTemp.appointmentId, action: 2, remark: this.rejectionTemp.remark })
              this.$message.success('操作成功')
              this.reset()
              this.updateTablePageListParams({})
            } catch (error) {
              console.log(error)
            }
          }).catch(() => {
            console.log('用户取消操作')
          })
        }
      })
    },
    reset() {
      this.rejectionTemp = {
        visible: false,
        loading: false,
        rejectionTemp: undefined,
        remark: ''
      }
      this.$refs.form.clearValidate()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
