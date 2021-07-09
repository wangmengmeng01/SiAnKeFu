<template>
  <div class="app-container gift-list">
    <TablePage
      show-search
      :search-cols="4"
      :search-fields="filterForm"
      :search-buttons="searchButtons"
      :search-submit-fn="tablePageSearchSubmit"
      :table-cols="tableCols"
      :get-list-fn="getTablePageList"
      :get-list-response-keys="{
        list: 'list',
        total: 'total',
        size: 'pageSize',
        current: 'pageNum',
      }"
      :refresh="tablePageRefresh"
      @search-change="tablePageSearchChange"
      @page-change="tablePagePageChange"
    >
      <add-edit-gift
        slot="table-header"
        @success="updateTablePageListParams({})"
      >添加礼物</add-edit-gift>
      <template slot="giftStatusName" slot-scope="{ row }">
        <span :class="{'status-on': row.giftStatusName=== '已上架', 'status-off': row.giftStatusName=== '已下架'}">{{ row.giftStatusName }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <add-edit-gift
          :row="{ ...row }"
          type="edit"
          btn-size="mini"
          @success="updateTablePageListParams({})"
        >编辑</add-edit-gift>
        <el-button
          :type="row.status === 0 ? 'success' : 'danger'"
          size="mini"
          plain
          @click="putOff(row.giftId, row.giftStatus === 0 ? 1 : 0)"
        >{{ row.giftStatus === 0 ? "上架" : "下架" }}</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>
import API from '@/api/gift-manager'
import TablePageMixin from '@/mixins/table-page'
import addEditGift from './add-edit-gift'

export default {
  name: 'GiftList',
  components: {
    addEditGift
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'dict-select',
          value: '-1',
          label: '状态：',
          name: 'giftStatus',
          dictType: 'gift_status',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '礼物类型：',
          name: 'giftType',
          dictType: 'gift_type',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'sortNo', label: '序号' },
        { prop: 'giftName', label: '礼物名称' },
        { prop: 'giftTypeName', label: '礼物类型' },
        // {
        //   prop: 'doubleHit',
        //   label: '是否连击',
        //   formatter: (r, c) => ['否', '是'][r[c]]
        // },
        { prop: 'giftPrice', label: '礼物单价(钻石)' },
        { prop: 'giftStatusName', label: '状态', slot: true },
        {
          prop: 'action',
          label: '操作',
          slot: true,
          fixed: 'right',
          width: '200px'
        }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 上架下架
    putOff(giftId, giftStatus) {
      this.$confirm(
        giftStatus === 0 ? `确定要下架该礼物吗？` : `确认要上架该礼物吗？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async() => {
          try {
            await API[this.$route.path].putOff({ giftId, giftStatus })
            this.$message.success('操作成功')
            this.updateTablePageListParams({})
          } catch (error) {
            console.log(error)
          }
        })
        .catch(() => {
          console.log('用户取消操作')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
