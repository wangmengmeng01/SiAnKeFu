<template>
  <el-table
    :ref="table.refKey"
    v-loading="table.loading === 0"
    :data="list"
    :height="table.height"
    :max-height="table.maxHeight"
    :default-sort="table.defaultSort"
    :row-key="table.rowKey"
    :empty-text="emptyText"
    class="table-list-container"
    :class="customClass"
    @selection-change="handleSelectionChange"
    @sort-change="handleSortChange"
  >
    <template v-for="(h, i) in table.cols">
      <el-table-column
        v-if="h.type === 'selection'"
        :key="i"
        :type="h.type"
        :width="h.width"
        :label="h.label"
        :fixed="h.fixed"
        :reserve-selection="h.reserveSelection"
        :selectable="h.selectable"
      />
      <el-table-column
        v-else-if="h.type === 'index'"
        :key="i"
        :type="h.type"
        :width="h.width"
        :label="h.label"
        :fixed="h.fixed"
      />
      <el-table-column
        v-else-if="h.type === 'action'"
        :key="i"
        :width="h.width"
        :label="h.label"
        :fixed="h.fixed"
      >
        <template slot-scope="scope">
          <template v-for="(a, j) in h.actions">
            <el-button
              v-if="table.access(a, scope.row, scope.column, scope.$index)"
              :key="j"
              :type="a.type || 'primary'"
              :size="a.size || 'mini'"
              :plain="a.plain || true"
              :round="a.round || false"
              :circle="a.circle || false"
              @click="clickHandle(a.action, scope.row, scope.column, scope.$index)"
            >{{ a.text }}</el-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        v-else
        :key="i"
        :prop="h.prop"
        :label="h.label"
        :width="h.width"
        :fixed="h.fixed"
        :show-overflow-tooltip="h.showOverflowTooltip"
        :sortable="h.sortable"
      >
        <template slot-scope="scope">
          <slot v-if="h.slot" :row="scope.row" :name="h.prop" />
          <template v-else>
            {{
              (h.formatter && h.formatter(scope.row, h.prop)) ||
                scope.row[h.prop]
            }}
          </template>
        </template>
      </el-table-column>
    </template>
    <slot
      v-if="$slots.empty && (table.loading === 1 || table.loading === -1)"
      slot="empty"
      name="empty"
    />
    <div v-else-if="table.loading === -1" slot="empty" class="table-list-error">
      <template>
        <span>{{ emptyText }}</span>,
        <a href="javascript:void(0)" @click="refresh">点此重试</a>
      </template>
    </div>
  </el-table>
</template>
<script>
import { debounce } from '@/utils'
export default {
  name: 'TableList',
  props: {
    table: {
      type: Object,
      /**
       * {
       *   defaultSort: {prop: 'test', order: 'ascending'}, // 设置默认排序字段和排序方式
       *   height: '',  // 用于固定表头
       *   maxHeight: '', // 灵活高度，详见 https://element.eleme.cn/#/zh-CN/component/table#liu-ti-gao-du
       *   loading: 0, // -1|0|1 加载标识 -1 -> error, 0 -> loading, 1 -> ok
       *   loadingText: 'Loading...', // 加载中的文案
       *   emptyText: 'Empty', // 无数据的文案
       *   errorText: 'Error', // 加载失败的文案
       *   data: [], // 列表数据
       *   cols: [
       *     {
       *       type: 'selection', // selection|index|action
       *       prop: 'test', // 列字段名
       *       label: '测试', // 列字段显示文案
       *       width: 200, // 列宽
       *       fixed: '', // 固定列标识 left|right
       *       formatter(row, prop){}, // 格式化
       *       showOverflowTooltip: true, // true|false 单行缩略显示标识
       *       sortable: true, // true|false|custom 列筛选标识
       *       actions: [
       *         {
       *           type: 'primary',  // 参考elementui的button组件
       *           size: 'mini',
       *           text: '查看',  // 按钮文本
       *           action(row, col, index) {} // 按钮点击行为回调
       *         }
       *       ],
       *       selectable(row, index), // return true|false 确定能否勾选本条数据
       *       reserveSelection, // true|false 保持分页切换时的选中项
       *     }
       *   ],
       *   rowKey: '', // 在reserveSelection === true时需用上
       *   selectChange(val){}, // 选中回调
       *   sortChange(val){}, // 排序回调
       *   access(row, col, index){} // 按钮访问权限控制
       *   refresh() {} // 刷新方法
       * }
       */
      default: () => ({})
    },
    customClass: {
      type: String,
      default: () => ''
    }
  },
  computed: {
    emptyText() {
      if (this.table.loading === 0) {
        return this.table.loadingText || '拼命加载中...'
      } else {
        if (
          this.table.loading === 1 &&
          (!this.table.data || this.table.data.length < 1)
        ) {
          return this.table.emptyText || '暂无数据'
        }
        return this.table.errorText || '加载失败'
      }
    },
    list() {
      if (this.table.loading <= 0) {
        return []
      } else {
        return this.table.data
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      if (typeof this.table.selectChange === 'function') {
        this.table.selectChange(val)
      }
    },
    handleSortChange(val) {
      if (typeof this.table.sortChange === 'function') {
        this.table.sortChange(val)
      }
    },
    clickHandle: debounce(function(action, row, column, index) {
      if (typeof action === 'function') {
        action(row, column, index)
      }
    }, 500),
    refresh() {
      typeof this.table.refresh === 'function' && this.table.refresh()
    }
  }
}
</script>
<style scoped lang="scss">
.table-list {
  &-container {
    border-top: 1px solid #EBEEF5;
    border-left: 1px solid #EBEEF5;
    border-right: 1px solid #EBEEF5;
    ::v-deep {
      .el-table__header th {
        color: #1f2d3d;
        background-color: #f8f8f9;
      }
    }
  }
}
</style>