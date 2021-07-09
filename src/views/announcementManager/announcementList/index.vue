<template>
  <div class="app-container announcement-list">
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
      <add-edit-announcement slot="table-header" @success="updateTablePageListParams({})">发布公告</add-edit-announcement>
      <template slot="action" slot-scope="{ row }">
        <el-button v-if="row.status===1" v-clipboard="getCopyUrl(row.id)" v-clipboard:success="copySuccess" v-clipboard:error="copyError" type="text" size="mini" icon="el-icon-copy-document" style="margin-right: 15px;">复制链接</el-button>
        <add-edit-announcement v-if="row.status!==1" :row="{...row}" type="edit" btn-size="mini" @success="updateTablePageListParams({})">编辑</add-edit-announcement>
        <el-button v-if="row.status===0" type="danger" plain size="mini" style="margin-right: 15px;" @click="cancelPublish(row.id)">取消发布</el-button>
        <view-announcement :row="{...row}">查看详情</view-announcement>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/announcement-manager'
import TablePageMixin from '@/mixins/table-page'
import addEditAnnouncement from './add-edit-announcement'
import viewAnnouncement from './view-announcement'

export default {
  name: 'AnnouncementList',
  components: {
    addEditAnnouncement, viewAnnouncement
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'datepicker',
          dateType: 'daterange',
          value: [],
          valueFormat: 'yyyy-MM-dd HH:mm:ss',
          defaultTime: ['00:00:00', '23:59:59'],
          label: '发布时间：',
          name: 'presetPublishTime',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '公告类型：',
          name: 'type',
          dictType: 'platform_notice_type',
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
          dictType: 'platform_notice_status',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        }
      ],
      // table列字段集合
      tableCols: [
        { prop: 'title', label: '官方公告标题' },
        { prop: 'typeName', label: '公告类型' },
        { prop: 'statusName', label: '状态' },
        { prop: 'isPush', label: '是否推送', formatter: (r, c) => (['否', '是'][r[c]]) },
        { prop: 'updateTime', label: '编辑时间' },
        { prop: 'publishTime', label: '发布时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '300px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    // 取消发布
    cancelPublish(id) {
      this.$confirm(`确定要取消发布该公告吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].cancelPublish({ id })
          this.updateTablePageListParams({})
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    },
    copySuccess() {
      this.$message.success('复制成功')
    },
    copyError() {
      this.$message.error('复制失败')
    },
    getCopyUrl(id) {
      let mode = process.env.NODE_ENV
      if (process.env.VUE_APP_TITLE.includes('预演')) {
        mode = 'pre'
      }
      const obj = {
        'development': `https://h5-dev.sian.vip/announcement?id=${id}`,
        'test': `https://h5-test.sian.vip/announcement?id=${id}`,
        'pre': `https://h5-pre.sian.vip/agreement`,
        'production': `https://h5-pro.sian.vip/announcement?id=${id}`
      }
      return obj[mode]
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
