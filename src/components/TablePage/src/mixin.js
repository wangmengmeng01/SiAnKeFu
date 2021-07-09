import { cloneDeep } from '@/utils/index'

export default {
  components: {
    TablePage: () => import('./main')
  },
  data() {
    return {
      tablePageRefresh: false,
      // 筛选表单按钮组集合
      searchButtons: [
        { text: '搜索', name: 'submit', icon: 'el-icon-search' },
        { text: '重置', name: 'reset', icon: 'el-icon-refresh-right', type: 'default', action: this.onReset }
      ],
      filterForm: [],
      getTablePageListParams: {},
      resetFilterForm: [],
      resetParams: {}
    }
  },
  created() {
    // 默认参数
    this.resetFilterForm = cloneDeep(this.filterForm)
    this.resetFilterForm.forEach((item, index) => {
      if (item.value === '' || (Array.isArray(item.value) && item.value.length === 0) || item.value === null || item.value === undefined) {
        // 过滤控值
      } else {
        this.getTablePageListParams[item.name] = item.value
      }
    })
    this.resetParams = cloneDeep(this.getTablePageListParams)
  },
  methods: {
    // 重置参数
    onReset() {
      this.getTablePageListParams = cloneDeep(this.resetParams)
      this.filterForm = cloneDeep(this.resetFilterForm)
    },
    tablePageTableAccess(/* name, row */) {
      return true
    },
    tablePageSearchChange({ value, field: { name }}) {
      this.getTablePageListParams = this.getTablePageListParams || {}
      if (value === '' || (Array.isArray(value) && value.length === 0) || value === null || value === undefined) {
        delete this.getTablePageListParams[name]
      } else {
        Object.assign(this.getTablePageListParams, { [name]: value })
      }
    },
    tablePagePageChange({ size, current }) {
      const params = {
        [current ? 'pageNum' : 'pageSize']: current || size
      }
      if (params.pageSize) {
        params.pageNum = 1
      }
      this.updateTablePageListParams({ ...params })
    },
    tablePageSearchSubmit() {
      this.tablePagePageChange({ current: 1 })
    },
    async getTablePageList() {
      try {
        this.updateTablePageListParams()
        // 取查询参数胡页码，防止出现页码显示和查询结果不一致的bug
        const { pageNum, pageSize } = this.getTablePageListParams
        // 处理参数
        const params = cloneDeep(this.getTablePageListParams)
        const keys = Object.keys(params)
        keys.forEach(key => {
          if (key.match('Time') && Array.isArray(params[key]) && params[key].length > 1) {
            params[key + 'Before'] = params[key][0]
            params[key + 'After'] = params[key][1]
            delete params[key]
          }
          if ((!params[key] && params[key] !== 0) || (Array.isArray(params[key]) && params[key].length === 0)) {
            delete params[key]
          }
        })
        const { data } = await this.$api[this.getTablePageListName || 'getList'](
          { ...params }
        )
        return Array.isArray(data) ? { list: data, pageNum: pageNum, pageSize: pageSize } : { ...data, pageNum: pageNum, pageSize: pageSize }
      } catch (ex) {
        console.log(ex)
        return Promise.reject(ex)
      }
    },
    updateTablePageListParams(params) {
      this.getTablePageListParams = this.getTablePageListParams || {}
      Object.assign(this.getTablePageListParams, params || {})
      this.getTablePageListParams.pageNum = this.getTablePageListParams.pageNum || 1
      this.getTablePageListParams.pageSize = this.getTablePageListParams.pageSize || 10
      if (params) {
        this.tablePageRefresh = true
        if (this.tablePageRefreshTimer) clearTimeout(this.tablePageRefreshTimer)
        this.tablePageRefreshTimer = setTimeout(() => {
          this.tablePageRefresh = false
        }, 10)
      }
    }
  }
}
