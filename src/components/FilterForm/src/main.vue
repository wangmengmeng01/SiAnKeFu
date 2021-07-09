<template>
  <div class="filter-form-container" :class="customClass">
    <template v-if="!$slots.default">
      <template v-for="i in rows">
        <template v-for="j in cols">
          <el-col
            v-if="j - 1 + cols * (i - 1) < fields.length"
            :key="i + '-' + j"
            class="filter-form-field"
            :lg="lg"
            :md="md"
            :sm="sm"
            :style="fields[j - 1 + cols * (i - 1)].colStyle"
          >
            <span
              v-if="!!fields[j - 1 + cols * (i - 1)].label"
              class="filter-form-field-label"
              :style="fields[j - 1 + cols * (i - 1)].labelStyle"
            >{{ fields[j - 1 + cols * (i - 1)].label }}</span>
            <el-input
              v-if="regType.test(fields[j - 1 + cols * (i - 1)].type)"
              v-model="fields[j - 1 + cols * (i - 1)].value"
              class="filter-form-field-input"
              :type="fields[j - 1 + cols * (i - 1)].type"
              :maxlength="fields[j - 1 + cols * (i - 1)].maxlength"
              :placeholder="fields[j - 1 + cols * (i - 1)].placeholder"
              :clearable="fields[j - 1 + cols * (i - 1)].clearable"
              :show-password="fields.showPassword"
              :disabled="fields[j - 1 + cols * (i - 1)].disabled"
              :prefix-icon="fields[j - 1 + cols * (i - 1)].prefixIcon"
              :suffix-icon="fields[j - 1 + cols * (i - 1)].suffixIcon"
              :rows="fields[j - 1 + cols * (i - 1)].rows"
              :autosize="fields[j - 1 + cols * (i - 1)].autosize"
              :autocomplete="fields[j - 1 + cols * (i - 1)].autocomplete"
              @change="change($event, fields[j - 1 + cols * (i - 1)])"
              @input="inputChange($event, fields[j - 1 + cols * (i - 1)])"
            >
              <template
                v-if="!!fields[j - 1 + cols * (i - 1)].prepend"
                slot="prepend"
              >{{ fields[j - 1 + cols * (i - 1)].prepend }}</template>
              <template
                v-if="!!fields[j - 1 + cols * (i - 1)].append"
                slot="append"
              >{{ fields[j - 1 + cols * (i - 1)].append }}</template>
              <i
                v-if="!!fields[j - 1 + cols * (i - 1)].prefix"
                slot="prefix"
                :class="fields[j - 1 + cols * (i - 1)].prefix"
              />
              <i
                v-if="!!fields[j - 1 + cols * (i - 1)].suffix"
                slot="suffix"
                :class="fields[j - 1 + cols * (i - 1)].suffix"
              />
            </el-input>
            <el-radio-group
              v-if="'radio' === fields[j - 1 + cols * (i - 1)].type"
              v-model="fields[j - 1 + cols * (i - 1)].value"
              @change="change($event, fields[j - 1 + cols * (i - 1)])"
            >
              <el-radio
                v-for="o in fields[j - 1 + cols * (i - 1)].options"
                :key="o.value"
                :label="o.value"
                :disabled="!!o.disabled"
              >{{ o.label }}</el-radio>
            </el-radio-group>
            <el-checkbox-group
              v-if="'checkbox' === fields[j - 1 + cols * (i - 1)].type"
              v-model="fields[j - 1 + cols * (i - 1)].value"
              @change="change($event, fields[j - 1 + cols * (i - 1)])"
            >
              <el-checkbox
                v-for="o in fields[j - 1 + cols * (i - 1)].options"
                :key="o.value"
                :label="o.value"
                :disabled="!!o.disabled"
              >{{ o.label }}</el-checkbox>
            </el-checkbox-group>
            <el-select
              v-if="'select' === fields[j - 1 + cols * (i - 1)].type"
              v-model="fields[j - 1 + cols * (i - 1)].value"
              class="filter-form-field-input"
              :placeholder="fields[j - 1 + cols * (i - 1)].placeholder"
              :disabled="fields[j - 1 + cols * (i - 1)].disabled"
              :clearable="fields[j - 1 + cols * (i - 1)].clearable"
              :multiple="fields[j - 1 + cols * (i - 1)].multiple"
              :collapse-tags="fields[j - 1 + cols * (i - 1)].collapseTags"
              :filterable="fields[j - 1 + cols * (i - 1)].filterable"
              :allow-create="fields[j - 1 + cols * (i - 1)].allowCreate"
              :remote="fields[j - 1 + cols * (i - 1)].remote"
              :remote-method="fields[j - 1 + cols * (i - 1)].remoteMethod"
              :loading="fields[j - 1 + cols * (i - 1)].loading"
              :loading-text="fields[j - 1 + cols * (i - 1)].loadingText"
              @change="change($event, fields[j - 1 + cols * (i - 1)])"
            >
              <el-option
                v-for="o in fields[j - 1 + cols * (i - 1)].options"
                :key="o.value"
                :label="o.label"
                :value="o.value"
              />
            </el-select>
            <!-- 自定义select -->
            <saSelect
              v-if="'sa-select' === fields[j - 1 + cols * (i - 1)].type"
              v-model="fields[j - 1 + cols * (i - 1)].value"
              class="filter-form-field-input"
              :placeholder="fields[j - 1 + cols * (i - 1)].placeholder"
              :options="fields[j - 1 + cols * (i - 1)].options"
              :label-format="fields[j - 1 + cols * (i - 1)].labelFormat"
              :label-key="fields[j - 1 + cols * (i - 1)].labelKey"
              :value-key="fields[j - 1 + cols * (i - 1)].valueKey"
              :search-key="fields[j - 1 + cols * (i - 1)].searchKey"
              :list-key="fields[j - 1 + cols * (i - 1)].listKey"
              :size="fields[j - 1 + cols * (i - 1)].size"
              :multiple="fields[j - 1 + cols * (i - 1)].multiple"
              :disabled="fields[j - 1 + cols * (i - 1)].disabled"
              :clearable="fields[j - 1 + cols * (i - 1)].clearable"
              :filterable="fields[j - 1 + cols * (i - 1)].filterable"
              :reserve-keyword="fields[j - 1 + cols * (i - 1)].reserveKeyword"
              :select-props="fields[j - 1 + cols * (i - 1)].selectProps"
              :raw="fields[j - 1 + cols * (i - 1)].raw"
              :url="fields[j - 1 + cols * (i - 1)].url"
              :http="fields[j - 1 + cols * (i - 1)].http"
              :params="fields[j - 1 + cols * (i - 1)].params"
              :config="fields[j - 1 + cols * (i - 1)].reserveKeyword"
              :query-api="fields[j - 1 + cols * (i - 1)].queryApi"
              :trigger-size="fields[j - 1 + cols * (i - 1)].triggerSize"
              :auto="fields[j - 1 + cols * (i - 1)].auto"
              :update="fields[j - 1 + cols * (i - 1)].update"
              :update-once="fields[j - 1 + cols * (i - 1)].updateOnce"
              @change="change($event, fields[j - 1 + cols * (i - 1)])"
            />
            <!-- 数据字典select -->
            <dictSelect
              v-if="'dict-select' === fields[j - 1 + cols * (i - 1)].type"
              v-model="fields[j - 1 + cols * (i - 1)].value"
              class="filter-form-field-input"
              :dict-type="fields[j - 1 + cols * (i - 1)].dictType"
              :exclude="fields[j - 1 + cols * (i - 1)].exclude"
              :placeholder="fields[j - 1 + cols * (i - 1)].placeholder"
              :options="fields[j - 1 + cols * (i - 1)].options"
              :label-format="fields[j - 1 + cols * (i - 1)].labelFormat"
              :label-key="fields[j - 1 + cols * (i - 1)].labelKey"
              :value-key="fields[j - 1 + cols * (i - 1)].valueKey"
              :search-key="fields[j - 1 + cols * (i - 1)].searchKey"
              :list-key="fields[j - 1 + cols * (i - 1)].listKey"
              :size="fields[j - 1 + cols * (i - 1)].size"
              :multiple="fields[j - 1 + cols * (i - 1)].multiple"
              :disabled="fields[j - 1 + cols * (i - 1)].disabled"
              :clearable="fields[j - 1 + cols * (i - 1)].clearable"
              :filterable="fields[j - 1 + cols * (i - 1)].filterable"
              :reserve-keyword="fields[j - 1 + cols * (i - 1)].reserveKeyword"
              :select-props="fields[j - 1 + cols * (i - 1)].selectProps"
              :raw="fields[j - 1 + cols * (i - 1)].raw"
              :url="fields[j - 1 + cols * (i - 1)].url"
              :http="fields[j - 1 + cols * (i - 1)].http"
              :params="fields[j - 1 + cols * (i - 1)].params"
              :config="fields[j - 1 + cols * (i - 1)].reserveKeyword"
              :query-api="fields[j - 1 + cols * (i - 1)].queryApi"
              :trigger-size="fields[j - 1 + cols * (i - 1)].triggerSize"
              :auto="fields[j - 1 + cols * (i - 1)].auto"
              :update="fields[j - 1 + cols * (i - 1)].update"
              :update-once="fields[j - 1 + cols * (i - 1)].updateOnce"
              @change="change($event, fields[j - 1 + cols * (i - 1)])"
            />
            <el-date-picker
              v-if="'datepicker' === fields[j - 1 + cols * (i - 1)].type"
              v-model="fields[j - 1 + cols * (i - 1)].value"
              class="filter-form-field-input"
              :placehoder="fields[j - 1 + cols * (i - 1)].placeholder"
              :disabled="fields[j - 1 + cols * (i - 1)].disabled"
              :clearable="fields[j - 1 + cols * (i - 1)].clearable"
              :type="fields[j - 1 + cols * (i - 1)].dateType || 'date'"
              :picker-options="fields[j - 1 + cols * (i - 1)].pickerOptions"
              :format="fields[j - 1 + cols * (i - 1)].format"
              :range-separator="
                fields[j - 1 + cols * (i - 1)].rangeSeparator || '至'
              "
              :start-placeholder="
                fields[j - 1 + cols * (i - 1)].startPlaceholder || '开始日期'
              "
              :end-placeholder="
                fields[j - 1 + cols * (i - 1)].endPlaceholder || '结束日期'
              "
              :default-value="fields[j - 1 + cols * (i - 1)].defaultValue"
              :value-format="fields[j - 1 + cols * (i - 1)].valueFormat"
              :default-time="fields[j - 1 + cols * (i - 1)].defaultTime"
              @change="change($event, fields[j - 1 + cols * (i - 1)])"
            />
            <el-time-select
              v-if="'timeselect' === fields[j - 1 + cols * (i - 1)].type"
              v-model="fields[j - 1 + cols * (i - 1)].value"
              class="filter-form-field-input"
              :placeholder="fields[j - 1 + cols * (i - 1)].placeholder"
              :disabled="fields[j - 1 + cols * (i - 1)].disabled"
              :clearable="fields[j - 1 + cols * (i - 1)].clearable"
              :picker-options="fields[j - 1 + cols * (i - 1)].pickerOptions"
              @change="change($event, fields[j - 1 + cols * (i - 1)])"
            />
            <el-time-picker
              v-if="'timepicker' === fields[j - 1 + cols * (i - 1)].type"
              v-model="fields[j - 1 + cols * (i - 1)].value"
              class="filter-form-field-input"
              :placeholder="fields[j - 1 + cols * (i - 1)].placeholder"
              :disabled="fields[j - 1 + cols * (i - 1)].disabled"
              :clearable="fields[j - 1 + cols * (i - 1)].clearable"
              :picker-options="fields[j - 1 + cols * (i - 1)].pickerOptions"
              :range-separator="
                fields[j - 1 + cols * (i - 1)].rangeSeparator || '至'
              "
              :start-placeholder="
                fields[j - 1 + cols * (i - 1)].startPlaceholder || '开始时间'
              "
              :end-placeholder="
                fields[j - 1 + cols * (i - 1)].endPlaceholder || '结束时间'
              "
              :arrow-control="fields[j - 1 + cols * (i - 1)].arrowControl"
              :is-range="fields[j - 1 + cols * (i - 1)].isRange"
              :editable="fields[j - 1 + cols * (i - 1)].editable"
              :default-value="fields[j - 1 + cols * (i - 1)].defaultValue"
              :value-format="fields[j - 1 + cols * (i - 1)].valueFormat"
              @change="change($event, fields[j - 1 + cols * (i - 1)])"
            />
          </el-col>
        </template>
        <div
          v-if="i === rows && !!btns"
          :key="i"
          class="last-column"
        >
          <template v-if="btns && btns.length">
            <template v-for="(btn, z) in btns">
              <el-button
                v-if="typeof btn.access === 'function' ? btn.access(btn) : true"
                :key="z"
                :size="btn.size || 'small'"
                :type="btn.type || 'primary'"
                :plain="btn.plain || false"
                :round="btn.round || false"
                :circle="btn.circle || false"
                :loading="btn.loading || false"
                :disabled="btn.disabled || false"
                :icon="btn.icon || ''"
                :style="btn.style"
                @click="clickHandle(btn)"
              >{{ btn.text }}</el-button>
            </template>
          </template>
        </div>
      </template>
    </template>
    <slot />
  </div>
</template>
<script>
import { debounce } from '@/utils'
import saSelect from '@/components/Select'
import dictSelect from '@/components/DictSelect'
export default {
  name: 'FilterForm',
  components: { saSelect, dictSelect },
  props: {
    customClass: {
      type: String,
      default: () => ''
    },
    fields: {
      type: Array,
      /*
        [
          {
            type: 'text|textarea|select|datepicker|timepicker|timeselect',
            dateType: 'date|daterange', // only for type == 'datepicker'
            value: '', // for v-model
            label: '',  // label text
            labelStyle: '', // label style
            colStyle: '' // columnn style
            //Other props same as https://element.eleme.cn/#/zh-CN/component/
          }
        ]
      */
      default: _ => []
    },
    // 列
    columns: {
      type: Number,
      default: _ => 4
    },
    // 提交按钮文本
    btnSubmitText: {
      type: String,
      default: _ => ''
    },
    // 重置按钮文本
    btnResetText: {
      type: String,
      default: _ => ''
    },
    // 提交回调
    onSubmit: {
      type: Function
    },
    // 重置回调
    onReset: {
      type: Function
    },
    // 列间距
    gutter: {
      type: Number,
      default: _ => 10
    },
    // 搜索表单按钮集合（提交｜重置等）
    btns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      regType: /^text(area)?$/
    }
  },
  computed: {
    cols() {
      return 24 % this.columns === 0 ? this.columns : 4
    },
    rows() {
      return Math.ceil(this.fields.length / this.cols)
    },
    lg() {
      return 24 / this.cols
    },
    md() {
      if (this.lg < 4) return this.lg + 1
      if (this.lg < 8) return this.lg + 2
      return this.lg + 4
    },
    sm() {
      if (this.md < 4) return this.md + 1
      if (this.md < 8) return this.md + 2
      return this.md + 4
    }
  },
  methods: {
    change(e, field) {
      this.$emit('change', {
        value: e,
        field
      })
    },
    inputChange: debounce(function(e, field) {
      this.$emit('change', {
        value: e,
        field
      })
    }, 800),
    clickHandle: debounce(function(btn) {
      const { name, action } = btn
      let method
      if (name === 'reset' || name === 'submit') {
        method = 'on' + name.slice(0, 1).toUpperCase() + name.slice(1)
        typeof this[method] === 'function' && this[method](btn)
        if (typeof action === 'function') {
          action(btn)
        }
      } else {
        typeof action === 'function' && action(btn)
      }
    }, 500)
  }
}
</script>
<style scoped lang="scss">
.filter-form {
  &-container {
    .last-column {
      padding-right: 5px;
      text-align: right;
    }
  }
  &-field {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    &-label {
      display: inline-block;
      padding-left: 10px;
    }
    &-input {
      flex: 1;
    }
  }
  .last-column {
    text-align: right;
  }
}
@media (max-width: 767px) {
  .filter-form {
    &-field {
      display: block;
      &-label {
        display: block;
        margin-bottom: 10px;
        padding-left: 0;
        text-align: left !important;
      }
      &-input {
        display: flex;
        width: auto;
      }
    }
  }
}
</style>
