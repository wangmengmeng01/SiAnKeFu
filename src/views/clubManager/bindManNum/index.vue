<template>
  <div class="app-container">
    <el-page-header title="返回" style="margin-bottom: 15px;" @back="$router.back()" />

    <TablePage
      show-search
      :search-cols="3"
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
      <el-button slot="customerNickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.customerUid}})">{{ row.customerNickname }}</el-button>
      <el-button slot="customerSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.customerUid}})">{{ row.customerSaId }}</el-button>

    </TablePage>
  </div>
</template>

<script>
import { cloneDeep } from '@/utils/index'
import API from '@/api/club-manager'
import TablePageMixin from '@/mixins/table-page'

export default {
  name: 'BindManNum',
  components: {

  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '用户昵称：',
          name: 'customerNickName',
          placeholder: '',
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
          label: '用户ID：',
          name: 'customerSaId',
          placeholder: '',
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
          label: '用户手机号：',
          name: 'customerMobile',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
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
          label: '绑定时间：',
          name: 'bindTime',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'customerNickName', label: '用户昵称', slot: true },
        { prop: 'customerSaId', label: '用户ID', slot: true },
        { prop: 'customerMobile', label: '用户手机号' },
        { prop: 'rechargeNum', label: '充值次数', formatter: (r, v) => (r.rechargeNum || '-') },
        { prop: 'rechargeValue', label: '累计充值钻石' },
        { prop: 'bindTime', label: '绑定时间' },
        { prop: 'rechargeInfoUpdateTime', label: '数据更新时间' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
    // console.log(this.$api)
  },
  methods: {
    async getTablePageList() {
      try {
        this.updateTablePageListParams()
        this.getTablePageListParams.anchorUid = this.$route.query.uid
        // 取查询参数胡页码，防止出现页码显示和查询结果不一致的bug
        const { pageNum, pageSize } = this.getTablePageListParams
        // 处理参数
        const params = cloneDeep(this.getTablePageListParams)
        const keys = Object.keys(params)
        keys.forEach(key => {
          if (key.match('Time') && Array.isArray(params[key]) && params[key].length > 1) {
            params[key + 'Before'] = params[key][0]
            params[key + 'After'] = params[key][1]
            delete params[key]
          }
          if ((!params[key] && params[key] !== 0) || (Array.isArray(params[key]) && params[key].length === 0)) {
            delete params[key]
          }
        })
        const { data } = await this.$api[this.getTablePageListName || 'getList'](
          { ...params }
        )
        return Array.isArray(data) ? { list: data, pageNum: pageNum, pageSize: pageSize } : { ...data, pageNum: pageNum, pageSize: pageSize }
      } catch (ex) {
        console.log(ex)
        return Promise.reject(ex)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
