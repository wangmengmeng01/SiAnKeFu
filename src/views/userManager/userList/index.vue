<template>
  <div class="app-container user-list">
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
      <el-button slot="nickName" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.nickName }}</el-button>
      <el-button slot="saId" slot-scope="{row}" size="mini" type="text" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">{{ row.saId }}</el-button>
      <template slot="realNameAuthorizeStatus" slot-scope="{ row }">
        <span :class="{'status-on': row.realNameAuthorizeStatus=== 1, 'status-off': row.realNameAuthorizeStatus=== 0}">{{ ['未实名', '已实名'][row.realNameAuthorizeStatus] }}</span>
      </template>
      <template slot="livePermissionStatus" slot-scope="{ row }">
        <span :class="{'status-on': row.livePermissionStatus=== 1, 'status-off': row.livePermissionStatus=== 0}">{{ ['无', '有'][row.livePermissionStatus] }}</span>
      </template>
      <template slot="active" slot-scope="{ row }">
        <span :class="{'status-on': row.active=== 0, 'status-off': row.active=== 1}">{{ ['正常', '禁用'][row.active] }}</span>
      </template>
      <template slot="action" slot-scope="{ row }">
        <el-button :type="row.status === 1 ? 'success' : 'danger'" plain size="mini" @click="ban(row.uid, row.active === 0 ? 1 : 0)">{{ row.active === 1 ? '解封' : '封禁' }}</el-button>
        <el-button type="primary" size="mini" plain @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.uid}})">查看</el-button>
      </template>
    </TablePage>
  </div>
</template>

<script>

import API from '@/api/user-manager'
import {findAllSource} from '@/api/configManager.js'
import TablePageMixin from '@/mixins/table-page'
export default {
  name: 'UserList',
  mixins: [TablePageMixin],
  data() {
    return {
      sourceList: [],
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
          type: 'text',
          value: '',
          label: '来源平台ID：',
          name: 'sourceId',
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
          type: 'text',
          value: '',
          label: '注册码：',
          name: 'registrationCode',
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
          type: 'select',
          value: -1,
          label: '账户状态：',
          name: 'active',
          options: [
            { value: -1, label: '全部' },
            { value: 0, label: '正常' },
            { value: 1, label: '封禁' }
          ],
          labelStyle: {
            display: 'inline-block',
            width: '130px',
            textAlign: 'right'
          }
        },
        {
          type: 'select',
          value: '',
          label: '来源平台：',
          name: 'sourceType',
          options: this.sourceList,
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
          label: '注册时间：',
          name: 'createTime',
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
          label: '最近活跃时间：',
          name: 'lastLivelyTime',
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
        { prop: 'goldNumber', label: '金币余额' },
        // { prop: 'realNameAuthorizeStatus', label: '实名认证', slot: true },
        // { prop: 'livePermissionStatus', label: '直播权限', slot: true },
        { prop: 'active', label: '用户状态', slot: true },
        // { prop: 'identificationName', label: '用户身份' },
        { prop: 'level', label: '等级' },
        { prop: 'createTime', label: '注册时间', width: '160px' },
        { prop: 'lastLivelyTime', label: '最近活跃时间', width: '160px' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  created() {
    this.findAllSource();
  },
  methods: {
    // 封禁解封用户
    ban(uid, active) {
      this.$confirm(active === 1 ? `确定要封禁该用户吗？` : `确认要解封该用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].ban({ uid, active })
          this.$message.success('操作成功')
          this.updateTablePageListParams({})
        } catch (error) {
          console.log(error)
        }
      }).catch(() => {
        console.log('用户取消操作')
      })
    },
    findAllSource(uid, active) {
      findAllSource({}).then((res) => {
        if (res.success) {
          res.data.push({id: '', name: '全部'})
          this.sourceList = res.data;
          this.sourceList.forEach(item => {
            item.value = item.id;
            item.label = item.name;
          });
          this.filterForm.forEach(item => {
            if (item.name == 'sourceType') {
              item.options = this.sourceList
            }
          })
        }
      }).catch(() => {
      })
    },
    exportFile() {
      this.$store.dispatch("app/exportFile",{
        url: '/console/user/download',
        data: this.getTablePageListParams,
        name: '用户列表',
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
