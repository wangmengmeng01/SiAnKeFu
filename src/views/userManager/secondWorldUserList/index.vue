<template>
  <div class="app-container second-world-user-list">
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
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import TablePageMixin from '@/mixins/table-page'

export default {
  name: 'SecondWorldUserList',
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
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '角色：',
          name: 'roleId',
          dictType: 'identity_role_type',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        },
        {
          type: 'datepicker',
          dateType: 'daterange',
          value: [],
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          label: '身份更新时间：',
          name: 'updateVipRoleTime',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '昵称', slot: true },
        { prop: 'saId', label: 'ID', slot: true },
        { prop: 'mobile', label: '手机号' },
        { prop: 'diamondNumber', label: '钻石余额' },
        { prop: 'roleName', label: '角色' },
        { prop: 'updateVipRoleTime', label: '身份更新时间', width: '160px' },
        { prop: 'joinClubNumber', label: '加入俱乐部数(不含自己创建)', width: '200px' },
        { prop: 'createClubNumber', label: '创建俱乐部数', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {}
}
</script>
<style lang="scss" scoped>

</style>
