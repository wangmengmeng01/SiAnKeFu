<template>
  <div class="app-container version-update">
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
      <add-version slot="table-header" @success="updateTablePageListParams({})">新增版本更新</add-version>
      <template slot="action" slot-scope="{ row }">
        <el-button @click="del(row.id)" type="text">删除</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/common-manager'
import {deleteVersion} from '@/api/configManager.js'
import TablePageMixin from '@/mixins/table-page'
import addVersion from './addVersion'

export default {
  name: 'VersionUpdate',
  components: {
    addVersion
  },
  mixins: [TablePageMixin],
  data() {
    return {
      // 筛选表单字段集合
      filterForm: [
        {
          type: 'dict-select',
          value: '-1',
          label: '平台：',
          name: 'platform',
          dictType: 'version_upgrade_platform',
          labelStyle: {
            display: 'inline-block',
            width: '100px',
            textAlign: 'right'
          }
        },
        {
          type: 'dict-select',
          value: '-1',
          label: '更新方式：',
          name: 'upgradeType',
          dictType: 'version_upgrade_type',
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
          label: '更新时间：',
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
        { prop: 'versionNo', label: '版本号' },
        { prop: 'platform', label: '平台' },
        { prop: 'upgradeType', label: '更新方式', formatter: (r, c) => (['', '普通更新', '强制更新'][Number(r[c])]) },
        { prop: 'summary', label: '更新内容' },
        { prop: 'createTime', label: '更新时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '100px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    del(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteVersion({id}).then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: "删除成功"
              });
              this.flag = false;
            }else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          }).catch(err => {

          })
        }).catch(() => {
        });

    }
  }
}
</script>
<style lang="scss" scoped>

</style>
