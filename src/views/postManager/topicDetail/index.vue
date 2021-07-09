<template>
  <div class="app-container topic-detail">

    <el-page-header title="话题列表" :content="`# ${$route.query.content} #`" style="margin-bottom: 15px;" @back="$router.push('/post-manager/topic-list')" />

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
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.createBy}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.createBy}})">{{ row.saId }}</el-button>
      <template slot="statusName" slot-scope="{ row }">
        <span :class="{'status-on': row.statusName=== '已上架', 'status-off': row.statusName=== '已下架'}">{{ row.statusName }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button :type="row.status === 2 ? 'success' : 'danger'" size="mini" plain @click="putOff(row.dynamicId, row.status === 2 ? 1 : 0)">{{ row.status === 2 ? '上架' : '下架' }}</el-button>
        <preview-topic-detail :row="{...row}">预览</preview-topic-detail>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/post-manager'
import TablePageMixin from '@/mixins/table-page'
import previewTopicDetail from '../postList/preview-post-detail'

export default {
  name: 'TopicDetail',
  components: {
    previewTopicDetail
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
          label: '用户删除：',
          name: 'active',
          dictType: 'is_del',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        },
        {
          name: 'topicId',
          value: this.$route.query.id
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '发布人昵称', slot: true },
        { prop: 'saId', label: '发布人ID', slot: true },
        { prop: 'viewCount', label: '浏览量' },
        { prop: 'likeCount', label: '累计点赞数' },
        { prop: 'commentCount', label: '累计评论数' },
        { prop: 'statusName', label: '状态', slot: true },
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
