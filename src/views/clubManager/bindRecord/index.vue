<template>
  <div class="app-container">
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
      <el-button slot="anchorNickname" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.anchorUid}})">{{ row.anchorNickname }}</el-button>
      <el-button slot="anchorSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.anchorUid}})">{{ row.anchorSaId }}</el-button>
      <el-button slot="bindManNum" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/club-manager/bind-man-num', query:{ uid: row.anchorUid}})">{{ row.bindManNum }}</el-button>

    </TablePage>
  </div>
</template>

<script>

import API from '@/api/club-manager'
import TablePageMixin from '@/mixins/table-page'

export default {
  name: 'BindRecord',
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
          label: '主播昵称：',
          name: 'anchorNickName',
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
          label: '主播ID：',
          name: 'anchorSaId',
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
          label: '主播手机号：',
          name: 'anchorMobile',
          placeholder: '',
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
        { prop: 'anchorNickname', label: '主播昵称', slot: true },
        { prop: 'anchorSaId', label: '主播ID', slot: true },
        { prop: 'anchorMobile', label: '主播手机号' },
        { prop: 'bindManNum', label: '绑定人数', slot: true },
        { prop: 'rechargeValue', label: '累计充值钻石', formatter: (r, v) => (r.rechargeValue || '-') }
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
