<template>
  <div class="app-container post-list">
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
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.createBy}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.createBy}})">{{ row.saId }}</el-button>
      <template slot="statusName" slot-scope="{ row }">
        <span :class="{'status-on': row.statusName=== '已上架', 'status-off': row.statusName=== '已下架'}">{{ row.statusName }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button :type="row.status === 2 ? 'success' : 'danger'" plain size="mini" @click="putOff(row.dynamicId, row.status === 2 ? 1 : 0)">{{ row.status === 2 ? '上架' : '下架' }}</el-button>
        <preview-post-detail :row="{...row}">预览</preview-post-detail>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/post-manager'
import TablePageMixin from '@/mixins/table-page'
import previewPostDetail from './preview-post-detail'

export default {
  name: 'PostList',
  components: {
    previewPostDetail
  },
  mixins: [TablePageMixin],
  data() {
    return {
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
          type: 'datepicker',
          dateType: 'daterange',
          value: [],
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          label: '上架时间：',
          name: 'lastPutTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '状态：',
          name: 'status',
          dictType: 'dynamic_resource_status_pagelist',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '谁可以看：',
          name: 'viewAuth',
          dictType: 'dynamic_view_auth',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '用户删除：',
          name: 'active',
          dictType: 'is_del',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '发布人昵称', slot: true },
        { prop: 'saId', label: '发布人ID', slot: true },
        { prop: 'likeCount', label: '累计点赞数' },
        { prop: 'commentCount', label: '累计评论数' },
        { prop: 'viewCount', label: '累计浏览量' },
        { prop: 'topicContent', label: '话题' },
        { prop: 'statusName', label: '状态', slot: true },
        { prop: 'viewAuthName', label: '谁可以看' },
        { prop: 'activeName', label: '用户删除' },
        { prop: 'lastPutTime', label: '上架时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 上架下架话题
    putOff(dynamicId, logic) {
      this.$confirm(logic === 0 ? `确定要下架该话题吗？` : `确认要上架该话题吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].putOff({ dynamicId, logic })
          this.updateTablePageListParams({})
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    },
    exportFile() {
      this.$store.dispatch("app/exportFile",{
        url: '/console/sns/app/dynamic/download',
        data: this.getTablePageListParams,
        name: '动态列表',
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
