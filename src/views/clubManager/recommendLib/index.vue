<template>
  <div class="app-container">
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
      <add-recommend slot="table-header" @success="updateTablePageListParams({})">新增推荐</add-recommend>
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.saId }}</el-button>
      <template slot="action" slot-scope="{ row }">
        <el-button type="primary" size="mini" plain @click="putOff(row.uid)">移出推荐</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/club-manager'
import TablePageMixin from '@/mixins/table-page'

export default {
  name: 'ClubList',
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
          name: 'nickName',
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
          label: '用户手机号：',
          name: 'mobile',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '120px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'select',
          value: -1,
          label: '渠道：',
          name: 'channelType',
          options: [
            { value: -1, label: '全部' },
            { value: 1, label: '个人申请' },
            { value: 0, label: '系统授权' }
          ],
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
          label: '推荐时间：',
          name: 'updateTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '昵称', slot: true },
        { prop: 'saId', label: 'ID', slot: true },
        { prop: 'mobile', label: '手机号' },
        { prop: 'recommendCount', label: '已推荐次数' },
        { prop: 'applyCount', label: '主动申请次数', width: '120px' },
        { prop: 'alreadyJoinCount', label: '已加入俱乐部数', width: '120px' },
        { prop: 'refuseCount', label: '被拒绝次数' },
        { prop: 'channelTypeName', label: '渠道' },
        { prop: 'updateTime', label: '最新推荐时间', width: '120px' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '100px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 移出推荐
    putOff(uid) {
      this.$confirm('确定要移出推荐吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].putOff({ uid })
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
