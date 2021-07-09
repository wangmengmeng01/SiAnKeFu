<template>
  <div class="app-container gift-history">
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
      <div slot="table-header">
        <el-button type="primary" size="small" icon="el-icon-download" @click="exportFile()">导出</el-button>
      </div>
      <el-button slot="giveNickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.giveUid}})">{{ row.giveNickName }}</el-button>
      <el-button slot="giveSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.giveUid}})">{{ row.giveSaId }}</el-button>
      <el-button slot="receiveNickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.receiveUid}})">{{ row.receiveNickName }}</el-button>
      <el-button slot="receiveSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.receiveUid}})">{{ row.receiveSaId }}</el-button>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/gift-manager'
import TablePageMixin from '@/mixins/table-page'

export default {
  name: 'GiftHistory',
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
          label: '礼物名称：',
          name: 'giftName',
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
          label: '赠送者ID：',
          name: 'giveSaId',
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
          label: '收礼者ID：',
          name: 'receiveSaId',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          },
          clearable: true
        },
        // {
        //   type: 'dict-select',
        //   value: '-1',
        //   label: '送礼场景：',
        //   name: 'itemType',
        //   dictType: 'give_gift_type',
        //   labelStyle: {
        //     display: 'inline-block',
        //     width: '130px',
        //     textAlign: 'right'
        //   }
        // },
        {
          type: 'datepicker',
          dateType: 'daterange',
          value: [],
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          label: '送礼时间：',
          name: 'giveGiftTime',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '状态：',
          name: 'giveGiftStatus',
          dictType: 'give_gift_status',
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'giveNickName', label: '赠送者', slot: true },
        { prop: 'giveSaId', label: '赠送者ID', slot: true },
        { prop: 'receiveNickName', label: '接收者', slot: true },
        { prop: 'receiveSaId', label: '接收者ID', slot: true },
        { prop: 'giftName', label: '礼物名称' },
        { prop: 'giftPrice', label: '礼物单价(钻石)' },
        // { prop: 'giftAmount', label: '礼物数量' },
        // { prop: 'totalValue', label: '礼物价值(钻石)' },
        // { prop: 'itemTypeName', label: '送礼场景' },
        { prop: 'createTime', label: '赠送时间' },
        { prop: 'statusName', label: '状态' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    exportFile() {
      this.$store.dispatch("app/exportFile",{
        url: '/console/member/gift/downloadGiveGift',
        data: this.getTablePageListParams,
        name: '礼物赠送记录',
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
