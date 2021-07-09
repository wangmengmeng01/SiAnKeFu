<template>
  <div class="table-page-container">
    <FilterForm
      v-if="showSearch"
      :columns="searchCols"
      :fields="searchFields"
      :btn-submit-text="searchSubmitText"
      :btn-reset-text="searchResetText"
      :on-submit="searchSubmitFn"
      :on-reset="searchResetFn"
      :btns="searchButtons"
      @change="searchChange"
    >
      <slot slot="default" name="search" />
    </FilterForm>
    <slot name="table-header" />
    <TableList :table="table" style="margin-top: 10px;">
      <!-- <slot
        v-for="s in table.cols"
        :slot="s.prop"
        slot-scope="scope"
        :name="s.prop"
        :row="scope.row"
      /> -->
      <template v-for="s in table.cols" :slot="s.prop" slot-scope="scope">
        <slot :name="s.prop" :row="scope.row" />
      </template>
    </TableList>
    <el-pagination
      v-if="showPage"
      :current-page="current"
      :page-sizes="pageSizes"
      :page-size="size"
      :layout="pageLayout"
      :total="total"
      @size-change="pageChange($event, 'size')"
      @current-change="pageChange($event, 'current')"
    />
  </div>
</template>
<script>
import FilterForm from '@/components/FilterForm'
import TableList from '@/components/TableList'
export default {
  name: 'TablePage',
  components: {
    FilterForm,
    TableList
  },
  // <slot name="search"/>
  props: {
    showSearch: {
      type: Boolean,
      // 是否显示搜索
      default: () => false
    },
    searchCols: {
      // 控制表单域显示列
      type: Number
    },
    searchFields: {
      // 搜索表单域字段数组
      type: Array
    },
    searchButtons: {
      // 搜索表单按钮数组
      type: Array
    },
    searchSubmitText: {
      type: String
    },
    searchResetText: {
      type: String
    },
    searchSubmitFn: {
      type: Function
    },
    searchResetFn: {
      type: Function
    },
    getListFn: {
      // 列表请求函数，须返回promise
      type: Function
    },
    getListResponseKeys: {
      // 列表响应解析字段名对象
      type: Object,
      default: () => ({
        list: 'list',
        total: 'total',
        size: 'pageSize',
        current: 'pageNum'
      })
    },
    parseListFn: {
      // 列表数据预解析函数，须返回数组
      type: Function
    },
    pageSizes: {
      // 分页sizes(https://element.eleme.cn/#/zh-CN/component/pagination)
      type: Array,
      default: () => [10, 50, 100, 200, 400]
    },
    pageLayout: {
      // 分页layout(https://element.eleme.cn/#/zh-CN/component/pagination)
      type: String,
      default: () => 'total, prev, pager, next, sizes, jumper, slot'
    },
    showPage: {
      type: Boolean,
      // 是否显示分页
      default: () => true
    },
    refresh: {
      // 控制表哥数据请求标识，true触发请求
      type: Boolean,
      default: () => false
    },
    tableCols: {
      // 表哥列
      type: Array
    },
    tableAccess: {
      // 按钮权限可见性控制函数，入参(action = {name}, row, col, index)
      // name为英文行为名，如add/edit/remove
      type: Function
    },
    tableRowKey: {
      type: String
    },
    tableSelectChange: {
      // 选中项
      type: Function
    }
  },
  data() {
    const tableAccess = () => true
    return {
      table: {
        loading: 0,
        refKey: this.tableRefKey,
        data: [],
        cols: this.tableCols,
        access: this.tableAccess || tableAccess,
        refresh: this.getList,
        errorText: '',
        loadingText: '',
        rowKey: this.tableRowKey,
        selectChange: this.tableSelectChange
      },
      current: 1,
      size: 10,
      total: 0
    }
  },
  watch: {
    tableCols(v) {
      const tableCols = [
        ...this.table.cols
      ]
      this.table.cols = Object.assign(tableCols, v)
    },
    refresh(v) {
      if (v) {
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.table.loading = 0
        const res = await this.getListFn()
        const page = {
          current: res[this.getListResponseKeys.current],
          size: res[this.getListResponseKeys.size],
          total: res[this.getListResponseKeys.total]
        }
        this.table.data = this.parseList(res[this.getListResponseKeys.list], page)
        this.current = page.current
        this.size = page.size
        this.total = page.total
        this.table.loading = 1
      } catch (ex) {
        this.table.errorText = ex.message || ex.msg || '加载失败'
        this.table.loading = -1
      }
    },
    parseList(list = [], page = {}) {
      list = Array.isArray(list) ? list : []
      page = (typeof page === 'object' && page) || {}
      if (this.parseListFn) {
        list = this.parseListFn(list, page)
        if (!Array.isArray(list)) {
          throw new Error('数据无效')
        }
      }
      return list
    },
    pageChange(v, k) {
      this[k] = v
      this.$emit('page-change', { [k]: v })
    },
    searchChange({ value, field }) {
      this.$emit('search-change', { value, field })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-page-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
}
.table-list-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  ::v-deep .el-table__body-wrapper {
    flex: 1;
    overflow-y: auto;
  }
}
.el-pagination {
  margin: 30px 0;
  overflow: auto;
  text-align: center;
  ::v-deep {
    .el-pager li.active,
    .el-pagination .el-pager li:hover {
      color: #02cdfa !important;
      border-color: #02cdfa !important;
    }
    .el-pagination__total {
      color: #333;
    }
    .btn-prev,
    .btn-next {
      padding-right: 6px;
      padding-left: 6px;
      border-radius: 4px;
      color: #999;
      border: 1px solid #dcdee2;
      &:hover {
        color: #99999a;
        border-color: #99999a;
      }
      &:disabled {
        color: rgba(#999, 0.5);
        border-color: rgba(#dcdee2, 0.5);
      }
    }
    .btn-next {
      margin-right: 15px;
    }
    .el-pager {
      margin-right: 10px;
      li {
        margin-left: 10px;
        border-radius: 4px;
        border: 1px solid #dcdee2;
        color: #999;
        &.active,
        &:hover {
          color: #02cdfa;
          border-color: #02cdfa;
        }
      }
    }
    .el-pagination__sizes {
      margin: 0;
      .el-input .el-input__inner {
        color: #999;
        &:hover {
          color: #2672ff;
          border-color: #2672ff;
        }
      }
    }
    .el-pagination__jump {
      margin-left: 5px;
    }
  }
}
</style>
