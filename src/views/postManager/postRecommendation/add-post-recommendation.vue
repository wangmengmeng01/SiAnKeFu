<template>
  <div class="add-post-recommendation">

    <!-- button部分 -->
    <el-button :type="btnType" icon="el-icon-plus" :size="btnSize" @click="init"><slot /></el-button>

    <!-- dialog部分 -->
    <el-dialog title="新增推荐" :visible.sync="visible" :close-on-click-modal="false" top="3vh" width="95%" @close="onReset">

      <TablePage
        v-if="visible"
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
        <template slot="statusName" slot-scope="{ row }">
          <span :class="{'status-on': row.statusName=== '已上架', 'status-off': row.statusName=== '已下架'}">{{ row.statusName }}</span>
        </template>
        <template slot="action" slot-scope="{ row }">
          <preview-post-detail :row="{...row}">预览</preview-post-detail>
          <el-button type="success" plain size="mini" @click="recommend(row.dynamicId)">推荐</el-button>
        </template>
      </TablePage>

    </el-dialog>

  </div>
</template>

<script>
import API from '@/api/post-manager'
import TablePageMixin from '@/mixins/table-page'
import previewPostDetail from '../postList/preview-post-detail'
export default {
  name: 'AddPostRecommendation',
  components: {
    previewPostDetail
  },
  mixins: [TablePageMixin],
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      visible: false,
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
          label: '昵称：',
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
        }
      ],
      // 查询函数名
      getTablePageListName: 'getRecommendationList',
      // table列字段集合
      tableCols: [
        { prop: 'nickName', label: '发布人昵称' },
        { prop: 'saId', label: '发布人ID' },
        { prop: 'likeCount', label: '累计点赞数' },
        { prop: 'commentCount', label: '累计评论数' },
        { prop: 'viewCount', label: '累计浏览量' },
        { prop: 'topicContent', label: '话题' },
        { prop: 'statusName', label: '状态', slot: true },
        { prop: 'lastPutTime', label: '上架时间' },
        { prop: 'action', label: '操作', slot: true, fixed: 'right', width: '200px' }
      ]
    }
  },
  beforeCreate() {
    this.$api = API[this.$route.path]
  },
  methods: {
    init() {
      this.visible = true
    },
    // 推荐
    recommend(dynamicId, isRecommend = 1) {
      this.$confirm(`确定要推荐吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].recommend({ dynamicId, isRecommend })
          this.updateTablePageListParams({})
          this.$emit('success')
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
