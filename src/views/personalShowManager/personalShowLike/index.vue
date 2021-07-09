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
      <div slot="table-header">
        <el-button type="primary" size="small"  icon="el-icon-download" @click="exportFile()">导出</el-button>
      </div>
      <personal-show-cover slot="videoResourceUrl" slot-scope="{row}" :row="row" />
      <el-button slot="publishNickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.publishUid}})">{{ row.publishNickName }}</el-button>
      <el-button slot="publishSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.publishUid}})">{{ row.publishSaId }}</el-button>
      <el-button slot="likeNickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.likeUid}})">{{ row.likeNickName }}</el-button>
      <el-button slot="likeSaId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.likeUid}})">{{ row.likeSaId }}</el-button>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/personal-show-manager'
import TablePageMixin from '@/mixins/table-page'
import personalShowCover from '../personalShowAudit/personal-show-cover'
export default {
  name: 'PayRecord',
  components: {
    personalShowCover
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'text',
          value: '',
          label: '发布者昵称：',
          name: 'publishNickName',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '120px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'text',
          value: '',
          label: '发布者ID：',
          name: 'publishSaId',
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
          label: '点赞者昵称：',
          name: 'likeNickName',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '120px',
            textAlign: 'right'
          },
          clearable: true
        },
        {
          type: 'text',
          value: '',
          label: '点赞者ID：',
          name: 'likeSaId',
          placeholder: '',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
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
          label: '点赞时间：',
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
        { prop: 'videoResourceUrl', label: '个人秀', slot: true },
        { prop: 'publishNickName', label: '发布者昵称', slot: true },
        { prop: 'publishSaId', label: '发布者ID', slot: true },
        { prop: 'likeNickName', label: '点赞者昵称', slot: true },
        { prop: 'likeSaId', label: '点赞者ID', slot: true },
        { prop: 'publishTime', label: '点赞时间' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    exportFile() {
      this.$store.dispatch("app/exportFile",{
        url: '/console/userShow/downloadLikeShow',
        data: this.getTablePageListParams,
        name: '个人秀点赞列表',
      })
    },
  }
}
</script>
<style lang="scss" scoped>

</style>
