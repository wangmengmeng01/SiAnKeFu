<template>
  <el-select
    v-model="model"
    class="common-select"
    :disabled="disabled"
    :value-key="valueKey"
    :filterable="filterable"
    :remote="remote"
    :reserve-keyword="reserveKeyword"
    :clearable="clearable"
    :placeholder="placeholder"
    :remote-method="remoteMethod"
    :loading="loading"
    :size="size"
    :multiple="multiple"
    v-bind="selectProps"
    v-on="bindEvents"
  >
    <el-option v-for="item in optionsCurrent" :key="item.id" :label="labelFormat ? labelFormat(item) : item[labelKey]" :value="raw ? item : item[valueKey]" :disabled="item.disabled">
      <slot :item="item" :value="model" />
    </el-option>
    <slot slot="empty" name="empty" />
    <template slot="prefix">
      <i v-if="initing" class="el-icon-loading" />
      <slot v-else name="prefix" />
    </template>
  </el-select>
</template>

<script>
export default {
  name: 'Select',
  props: {
    value: [String, Number, Boolean, Object, Array],
    // 排除项
    exclude: {
      type: Array,
      default: () => []
    },
    // 占位符
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 选项数组
    options: {
      type: Array,
      default: () => []
    },
    // 选中Label格式化方法
    labelFormat: Function,
    labelKey: {
      type: String,
      default: 'label'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    searchKey: {
      type: String,
      default: 'searchKey'
    },
    listKey: {
      type: String,
      default: 'list'
    },
    size: {
      type: String,
      default: 'large'
    },
    multiple: Boolean,
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    reserveKeyword: {
      type: Boolean,
      default: true
    },
    selectProps: Object,
    // 保持原值，即绑定值为对象
    raw: Boolean,
    // 远程搜索URL
    url: String,
    // HTTP请求库
    http: Function,
    // 请求参数
    params: {
      type: Object,
      default: () => ({})
    },
    // 请求配置
    config: {
      type: Object,
      default: () => ({})
    },
    // 自定义接口
    queryApi: Function,
    // 触发远程搜索的字段长度
    triggerSize: {
      type: Number,
      default: 0
    },
    auto: {
      type: Boolean,
      default: true
    },
    update: Boolean,
    updateOnce: Boolean
  },
  data() {
    return {
      model: this.value,
      optionsDataSource: this.fixOptions(this.options),
      optionsCurrent: this.fixOptions(this.options),
      loading: false,
      initing: false,
      loaded: false
    }
  },
  computed: {
    request() {
      return this.http || this.zHttp
    },
    remote() {
      return Boolean(this.queryApi || (this.url && (this.http || this.zHttp)))
    },
    // Hack绑定事件，即令el-select组件绑定事件与当前z-select组件相同，且扩展部分事件返回值
    bindEvents() {
      const _events = {}
      Object.keys(this.$listeners || {}).forEach(key => {
        // 非绑定对象的情况下，通过change事件向上emit出当前选中项
        if (key === 'change' && !this.raw) {
          // 给el-select绑定change事件，且emit到z-select的change事件并拓展
          _events[key] = value => {
            this.$emit(
              key,
              value,
              this.multiple
                ? this.optionsCurrent.reduce((result, item) => {
                  if (value.includes(item[this.valueKey])) {
                    result.push(item)
                  }
                  return result
                }, [])
                : this.optionsCurrent.find(item => item[this.valueKey] === value)
            )
          }
        } else {
          _events[key] = e => {
            this.$emit(key, e)
          }
        }
      })
      return {
        ..._events,
        'visible-change': show => {
          if (this.remote && show) {
            if (this.updateOnce) {
              if (!this.loaded) {
                this.remoteMethod()
              }
            } else if (this.update) {
              this.remoteMethod()
            }
          }
          _events['visible-change'] && _events['visible-change'](show)
        }
      }
    }
  },
  watch: {
    value(val) {
      this.model = val
    },
    options(val) {
      if (val) {
        this.optionsCurrent = this.fixOptions(this.optionsCurrent)
      }
    }
  },
  created() {
    if (this.remote && this.auto) {
      this.initing = true
      this.remoteMethod()
    }
  },
  methods: {
    // 修复当前数据源包含当前选中项
    fixOptions(list) {
      let fixOptions = []
      if (this.raw) {
        if (this.multiple) {
          fixOptions = this.value && this.value.length > 0 ? [...this.value] : []
        } else {
          fixOptions = this.value && Object.keys(this.value).length > 0 ? [this.value] : []
        }
      }
      const hash = {}
      const options = [...fixOptions, ...this.options, ...list].reduce((result, item) => {
        if (!hash[item[this.valueKey]]) {
          // 如果当前元素的key值没有在hash对象里，则可放入最终结果数组
          hash[item[this.valueKey]] = true // 把当前元素key值添加到hash对象
          item[this.valueKey] && item[this.labelKey] && result.push(item) // 把当前元素放入结果数组
        }
        return result // 返回结果数组
      }, [])
      return options.filter((item) => {
        return !this.exclude.includes(item[this.valueKey])
      })
    },
    // 远程加载
    remoteMethod(val = '') {
      const searchText = val.trim()
      if (searchText.length >= this.triggerSize) {
        this.loading = true
        let requestPrimise
        if (this.queryApi) {
          requestPrimise = this.queryApi(searchText)
        } else {
          requestPrimise = this.request(searchText ? { [this.searchKey]: searchText, ...this.params } : this.params)
        }
        requestPrimise
          .then(res => {
            const response = res || {}
            const options = this.fixOptions(Array.isArray(response.data) ? response.data : response.data[this.listKey])
            this.optionsDataSource = options
            this.optionsCurrent = options
          })
          .finally(() => {
            this.loading = false
            this.initing = false
            this.loaded = true
          })
      } else {
        this.optionsCurrent = this.optionsDataSource.filter(item => {
          return item[this.labelKey].includes(val)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.common-select {
  .el-input__prefix {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-loading {
      font-size: 16px
    }
  }
}
</style>
