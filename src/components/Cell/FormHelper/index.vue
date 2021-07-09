<!-- form-helper 组件 -->
<template>
  <el-form
    ref="form"
    class="form-helper"
    :model="model"
    :rules="rules"
    :label-position="labelPosition"
    :validate-on-rule-change="false"
  >
    <div
      v-for="(group, groupIndex) in localItems"
      :key="groupIndex"
      class="wrap-item"
    >
      <!-- 组名 -->
      <div
        v-if="!$tool.isBlank(group.groupName)"
        class="group-name"
      >
        {{ group.groupName }}
      </div>
      <!-- 小组中的表单项 -->
      <div
        class="form-item-wrap"
        :style="getFormItemWrapStyle(group)"
        :class="{inline: group.inline}"
      >
        <div
          v-for="(form, formIndex) in group.items"
          :key="formIndex"
          class="form-item"
          :style="getFormItemStyle(group)"
          :class="group.labelPosition"
        >
          <!-- 文本标题 -->
          <span
            class="label"
            :style="getLabelWidth(form)"
          >
            <span
              v-if="!hideRequiredAsterisk && form.rule && form.rule.required"
              class="required"
            >*</span>
            <span v-if="form.label">{{ form.label }}{{ form.labelSplit }}</span>
          </span>

          <!-- 表单内容 -->
          <div class="form-content">
            <!-- 前置文本 -->
            <span
              v-if="!$tool.isBlank(form.prefixText)"
              class="prefix-text"
            >{{
              form.prefixText
            }}</span>
            <!-- 表单项 -->
            <el-form-item
              ref="formItem"
              :prop="form.prop"
              :class="form.formItemClass"
            >
              <!-- 输入框、文本域、密码框 -->
              <el-input
                v-if="['input', 'textarea', 'password'].includes(form.type)"
                ref="control"
                v-model="model[form.prop]"
                class="input"
                :class="getInputClass(form)"
                :rows="form.rows"
                :maxlength="form.maxlength"
                :show-word-limit="form.showWordLimit"
                :type="form.type"
                :style="getStyle(form)"
                :disabled="form.disabled"
                :show-password="form.type === 'password' && form.showPassword"
                clearable
                resize="none"
                :placeholder="getPlaceholder(form)"
                @input="onInputInput(form)"
                @change="onChange(form)"
              >
                <i
                  v-if="form.inputUnit"
                  slot="suffix"
                  style="font-style: normal; margin-right: 10px"
                >{{ form.inputUnit }}</i>
                <img
                  v-if="form.inputPrefix"
                  slot="prefix"
                  :src="form.inputPrefix"
                >
              </el-input>
              <span v-if="form.unit">{{ form.unit }}</span>
              <!-- 树形下拉框控件 -->
              <treeselect
                v-else-if="form.type === 'treeSelect'"
                v-model="model[form.prop]"
                placeholder="请选择"
                :flat="true"
                :multiple="form.multiple"
                :options="form.options"
                @input="onChange(form.prop)"
              />

              <!-- 下拉框 -->
              <el-select
                v-else-if="['select', 'mulSelect'].includes(form.type)"
                v-model="model[form.prop]"
                class="select"
                :class="getInputClass(form)"
                :style="getStyle(form)"
                :multiple="form.type === 'mulSelect'"
                :filterable="form.filterable"
                :disabled="form.disabled"
                :placeholder="getPlaceholder(form)"
                collapse-tags
                :clearable="form.type === 'select' || form.type === 'mulSelect'"
                @visible-change="onSelectPannelChange($event, form)"
                @change="onChangeForSelect($event, form)"
                @clear="onClearForSelect($event, form)"
              >
                <el-option
                  v-for="(option, index) in form.options"
                  v-show="!option.disabled"
                  :key="index"
                  :disabled="option.disabled"
                  :label="getSelectOptionLabel(option, form)"
                  :value="option[form.optionValue || 'value']"
                />
              </el-select>
              <!-- Cascader 级联选择器 -->
              <el-cascader
                v-else-if="form.type === 'cascader'"
                v-model="model[form.prop]"
                class="select"
                :class="getInputClass(form)"
                :style="getStyle(form)"
                :disabled="form.disabled"
                :options="form.options"
                :placeholder="getPlaceholder(form)"
                collapse-tags
                :props="form.props"
                clearable
                @visible-change="onSelectPannelChange($event, form)"
                @change="onChangeForSelect($event, form)"
                @clear="onClearForSelect($event, form)"
              />
              <!-- Cascader 级联选择器 -->
              <el-cascader-multi
                v-else-if="form.type === 'cascader-multi'"
                v-model="model[form.prop]"
                class="select"
                :class="getInputClass(form)"
                :style="getStyle(form)"
                :disabled="form.disabled"
                :data="form.options"
                :children-key="'memberUser'"
                :label-key="'name'"
                :value-key="'id'"
                :only-last="true"
                :placeholder="getPlaceholder(form)"
                collapse-tags
                clearable
                @change="onChangeForSelect($event, form)"
                @clear="onClearForSelect($event, form)"
              />
              <!-- 单选框 -->
              <el-radio-group
                v-else-if="form.type === 'radio'"
                v-model="model[form.prop]"
                :class="form.class"
                :disabled="form.disabled"
                @change="onChange(form)"
              >
                <el-radio
                  v-for="(option, index) in form.options"
                  :key="index"
                  :label="option.value"
                >{{ option.label }}</el-radio>
              </el-radio-group>

              <!-- 日期选择器 -->
              <!-- @change="onChange(form)" -->
              <el-date-picker
                v-else-if="
                  ['date', 'datetime', 'datetimerange'].includes(form.type)
                "
                v-model="model[form.prop]"
                class="date"
                :type="form.type"
                :class="form.class"
                :style="getStyle(form)"
                :disabled="form.disabled"
                clearable
                editable
                :value-format="form.format"
                :format="form.format"
                :placeholder="getPlaceholder(form)"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="onChange(form)"
              />

              <!-- 上传 -->
              <!-- <el-upload
                class="uploadCla"
                drag
                :multiple="form.multiple"
                v-else-if="form.type === 'upload'"
                ref="upload"
                :action="form.uploadApi"
                :accept="form.accept"
                :headers="headers"
                :before-upload="beforeUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-change="changeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :xauto-upload="false"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或
                  <em>点击上传</em>
                </div>
                <div
                  class="el-upload__tip"
                  slot="tip"
                >
                  <span>请先下载模板，按照模板填写人员资料信息后再上传</span>
                  <br />
                  <a
                    style="color: #2b9bff"
                    @click="download"
                  >下载人员资料模板</a>
                </div>
              </el-upload> -->

              <!-- 文本 -->
              <span
                v-else-if="form.type === 'text'"
                :class="form.class"
                :style="getStyle(form)"
              >{{ model[form.prop] }}</span>

              <!-- 按钮 -->
              <el-button
                v-else-if="form.type === 'button'"
                class="button"
                :class="form.class"
                :type="form._type || 'primary'"
                :plain="form.plain"
                :loading="loading"
                @click="clickButton(form.handler)"
              >
                <img
                  v-if="form.prefix"
                  class="prefix"
                  :src="form.prefix"
                >
                {{ getButtonText(form) }}
                <img
                  v-if="form.suffix"
                  class="suffix"
                  :src="form.suffix"
                >
              </el-button>

              <!-- 自定义插槽 -->
              <slot
                v-else-if="form.type === 'slot'"
                :name="form.prop"
              />

              <!-- 尾部文本 -->
              <span v-if="form.tailLabel">{{ form.tailLabel }}</span>
            </el-form-item>

            <!-- 后置文本 -->
            <span
              v-if="!$tool.isBlank(form.suffixText)"
              class="suffix-text"
            >{{
              form.suffixText
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-form>
</template>

<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'FormHelper',
  components: { Treeselect },
  props: {
    /** 表单默认填写项 */
    value: {
      type: Object,
      default: () => ({})
    },

    /**
     * 表单项配置，完整属性如下：
     *
     * groupName - 当表单开启分组模式时，显示的组名
     * inline - 行内表单模式：true、false，默认 false
     * items - 当表单开启分组模式时，表单项的描述。如果不需要分组模式，可以省略以上配置，直接设置以下配置项即可。完整属性如下：
     *       type - 表单类型：input、radio、date、textarea、button、text 或 slot
     *       label - 标签文本(头部)
     *       tailLabel- 标签文本(尾部)
     *       width - 控件长度，如 200、'200px'、'30%'等，Number 类型单位默认是 px
     *       prop - value（表单数据对象）内的属性
     *       disabled - 是否禁用：true、false，默认 false
     *       prefix - button 前置图片，仅对 type='button' 时有效。
     *       suffix - button 前置图片，仅对 type='button' 时有效。
     *       color - 文本颜色，只支持 type为text时
     *       text - 按钮文本，仅对 type='button' 时有效
     *       rows -  输入框行数，仅对 type='textarea' 时有效
     *       rule - 校验规则，完整属性如下：
     *            required - 是否必填：true、false
     *            min - 文本输入最少字数
     *            max - 文本输入最大字数
     *            len - 文本输入字数限制
     *            trigger - 触发校验时机：blur、change、默认 change
     *            pattern - 自定义正则校验，完整属性如下：
     *                    reg - RegExp 实例
     *                    message - 校验不通过时的错误信息
     */
    items: {
      type: Array,
      default: () => []
    },

    /**
     * 表单域标签的位置，left、right 或 top
     * 备注：目前一个表单只能统一设置 label-position ，如果每个组需要同时满足行内和非行内，需要手写 label dom @TODO
     */
    labelPosition: {
      type: String,
      default: ''
    },
    uploadAction: {
      type: String,
      default: ''
    },

    /** 是否显示必填字段的标签旁边的红色星号 */
    hideRequiredAsterisk: {
      type: Boolean,
      default() {
        return this.$tool.getValueFromConfig(
          false,
          this,
          '$config.hideRequiredAsterisk'
        )
      }
    }
  },
  data() {
    return {
      model: {}, // 表单数据对象
      tempModel: {}, // 表单数据对象临时存储
      loading: false, // 防重点
      fileList: [],
      type: {
        phone: {
          reg: /^1(3|4|5|6|7|8|9)\d{9}$/,
          message: '格式不正确'
        }
      },
      headers: {
        Authorization: `Bearer ${this.$store.getters.token}`
      }
      //   uploadApi: this.$config.isDev
      //     ? `//${API_BASE_URL}/${this.$config.apiSuffix}/${this.uploadAction}`
      //     : `//${window.location.host.split(':')[0]}/${this.$config.apiSuffix}/${this.uploadAction
      //     }` // 非开发环境，后台接口访问域名是，部署前端资源的服务器地址
    }
  },
  computed: {
    /**
     * 解析表单项配置（value），统一格式化成分组模式
     */
    localItems() {
      this.renderControlStyle()
      const items = this.items.reduce((acc, item) => {
        item = item.items // 是分组形式的表单吗
          ? item // 分组形式
          : {
            // 普通形式
            items: [item]
          }
        !item.not && acc.push(item) // 添加需要展示的配置
        return acc
      }, [])

      // 过滤不需要展示的配置
      const _ = items.map(item => ({
        ...item,
        items: item.items.filter(item => !item.not)
      }))

      // 初始化tempModel
      _.forEach(item => {
        item.items.forEach(_item => {
          if (_item.type === 'mulSelect') {
            !this.model[_item.prop] && this.resetModel(_item.prop)
            this.setTempModel(_item.prop)
          }
        })
      })

      return _
    },

    /**
     * 解析表单校验规则
     */
    rules() {
      return this.$tool.deepCopy(this.localItems).reduce((acc, group) => {
        const groupRule = group.items.reduce((acc, form) => {
          const rule = form.rule
          if (rule) {
            // 填写了校验规则
            if (rule.type) {
              // 把特定表单转为普通表单
              rule.pattern = {
                reg: this.type[rule.type].reg,
                message: this.type[rule.type].message
              }
              Reflect.deleteProperty(rule, 'type')
              //   this.astrictPhoneInput('model.username')
            }
            // 校验普通表单
            const formRules = Object.keys(rule || {}).reduce(
              (acc, oneRuleOfForm) => {
                // 校验错误时，何时报错。如果没有设置 trigger ，则使用 form-helper 组件默认的设置，否则使用用户设置
                if (!rule.trigger) {
                  switch (form.type) {
                    case 'input':
                      rule.trigger = 'blur'
                      break
                    case 'radio':
                    case 'select':
                    case 'mulSelect':
                      rule.trigger = 'change'
                      break
                    case 'date':
                    case 'datetime':
                    case 'datetimerange':
                      rule.trigger = 'change'
                      break
                    default:
                      rule.trigger = 'blur'
                  }
                }
                // 校验错误时的报错信息
                // @todo：如果是 datetiemrange，未校验数组必须两个值，暂时问题不大
                const { label, messageLabel } = form
                const subject = messageLabel || label || ''
                switch (oneRuleOfForm) {
                  case 'required':
                    rule.message = `${subject}不能为空`
                    break
                  case 'min':
                    rule.message = `${subject}长度 ${rule.min} 至 ${rule.max} 个字符`
                    break
                  case 'max':
                    rule.message = `${subject}长度 ${rule.min} 至 ${rule.max} 个字符`
                    break
                  case 'len':
                    rule.message = `${subject}长度必须是${rule.len}个字符`
                    break
                  case 'pattern':
                    rule.message = `${subject}${rule.pattern.message}`
                    break
                }

                // 封装表单其中的一项校验项
                if (rule[oneRuleOfForm]) {
                  switch (oneRuleOfForm) {
                    case 'pattern':
                      rule.pattern = rule.pattern.reg
                      break
                  }
                  acc.push({
                    [oneRuleOfForm]: rule[oneRuleOfForm],
                    message: rule.message,
                    trigger: rule.trigger
                  })
                }

                return acc
              },
              []
            )
            formRules.length && (acc[form.prop] = formRules)
          }
          return acc
        }, {})
        return Object.assign(acc, groupRule)
      }, {})
    }
  },
  watch: {
    value: {
      /** 表单的值满足一下规则之一时触发：
       * （1）仅在输入框失去焦点或用户按下回车，并且输入的值发生改变时触发；
       */
      handler(newVal) {
        this.model = {
          ...this.$tool.deepCopy(this.value || {})
        }
        if (!this._notFirst) {
          this._model = this.$tool.filterObject(this.$tool.deepCopy(this.model))
          this._notFirst = true
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    resetModel(key) {
      this.model[key] = []
    },
    setTempModel(key) {
      this.tempModel[key] = this.model[key]
    },
    download() {
      window.open(
        this.$request.downTemplate({
          type: 'member'
        })
      )
    },
    /*
     * 生成 button text
     * @params {Object} form 表单描述
     */
    getButtonText({ text }) {
      if (typeof text === 'function') {
        return text()
      } else {
        return text
      }
    },

    /*
     * 生成 select 选项 label
     * @params {Object} option 下拉项
     * @params {Object} form 表单描述
     */
    getSelectOptionLabel(option, { optionLabel }) {
      if (typeof optionLabel === 'function') {
        return optionLabel(option)
      } else {
        return option[optionLabel || 'label']
      }
    },

    /*
     * 获取 Input class
     * @params {Object} form 表单描述
     */
    getInputClass(form) {
      const _ = []
      form.inputPrefix && _.push('prefix')
      _.concat(form.class)
      return _
    },

    /*
     * 输入框值改变时触发
     * @params {Object} form 表单描述
     */
    onInputInput(form) {
      const { notTrim, notBlank, prop, inputReg, rule } = form

      if (!notTrim) {
        // 需要去掉文本框首尾空格
        this.model[prop] = this.model[prop].trim()
      }
      if (!notBlank) {
        // 需要去掉文本框所有空格
        this.model[prop] = this.model[prop].replace(/ /g, '')
      }
      if (rule.max) {
        this.model[prop] = this.model[prop].slice(0, rule.max)
      }
      if (inputReg) {
        // 需要检测自定义输入正则
        this.model[prop] = this.model[prop]
          .split('')
          .filter(item => inputReg.test(item))
          .join('')
      }
    },

    /**
     * 限制手机号输入
     * @param {String} 字段层级
     */
    astrictPhoneInput(namespace) {
      this.$watch(namespace, newVal => {
        this.$nextTick(() => {
          const inputValue = this.$tool
            .getValueByNamespace(namespace, this)
            .trim()
          if (inputValue.length === 1 && inputValue.slice(0, 1) !== '1') {
            this.$tool.setValueByNamespace('', namespace, this)
          } else if (
            inputValue.length === 2 &&
            !/(3|4|5|6|7|8|9)$/.test(inputValue.slice(1, 2))
          ) {
            this.$tool.setValueByNamespace(
              inputValue.slice(0, 1),
              namespace,
              this
            )
          } else {
            this.$tool.setValueByNamespace(
              inputValue.slice(0, 11).replace(/\D/g, ''),
              namespace,
              this
            )
          }
        })
      })
    },
    /**
     * 是否朴素按钮
     * @param {Object} 表单信息
     * @returns Boolean true - 朴素、false - 非朴素
     *
     */
    isPalin({ plain }) {
      return this.$tool.isBlank(plain) ? true : plain
    },
    handleRemove(file, fileList) { },
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const arr = ['xlsx', 'xls']
      const extension = arr.indexOf(testmsg) !== -1
      if (!extension) {
        this.$message({
          message: '上传文件只能是xlsx、xls格式！',
          type: 'error'
        })
      }
      const isExceed2M = file.size / 1024 / 1024 < 2
      if (!isExceed2M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isExceed2M && extension
    },
    uploadSuccess(res) {
      this.$emit('uploadSuccess', res)
    },
    // 监听upload上传失败
    uploadError(err, file, fileList) {
      const errObj = JSON.parse(err['message'])
      this.$message({
        message: errObj.message,
        type: 'error',
        duration: 1500
      })
    },
    changeUpload(e) { },
    handlePreview(file) { },
    async clickButton(handler) {
      this.loading = true
      try {
        await this.$tool.wrapPromise(handler(this.model))
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    /**
     * 获取表单控件的 placeholder
     * @param {Object} 表单信息
     * @returns {String} placeholder
     */
    getPlaceholder(form) {
      const { placeholder, type } = form
      if (placeholder) {
        return placeholder
      }
      switch (type) {
        case 'input':
        case 'password':
          return this.$tool.getValueFromConfig(
            '请输入',
            this,
            '$config.placeholder.input'
          )
        case 'select':
        case 'mulSelect':
          return this.$tool.getValueFromConfig(
            '请选择',
            this,
            '$config.placeholder.select'
          )
        case 'textarea':
          return this.$tool.getValueFromConfig(
            '请填写',
            this,
            '$config.placeholder.input'
          )
        case 'date':
        case 'datetime':
        case 'datetimerange':
          return this.$tool.getValueFromConfig(
            '请选择',
            this,
            '$config.placeholder.input'
          )
      }
    },

    /**
     * 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
     */
    clearValidate() {
      this.$refs.form.clearValidate()
    },

    getFormItemStyle(group) {
      const { direction } = group
      // 处理 style 属性
      const _style = {}
      // 处理 direction 属性
      if (['around', 'bewteen'].includes(direction)) {
        // space-between、space-around 布局
        Object.assign(_style, {
          flex: 0
        })
      } else if (direction === 'center') {
        // 居中布局
        Object.assign(_style, {
          flex: 0
        })
      } else if (direction === 'left') {
        // 从左往右布局
        Object.assign(_style, {
          flex: 0
        })
      } else if (!direction || direction === 'average') {
        // 均分布局
        Object.assign(_style, {
          flex: 1
        })
      } else {
        // 均分布局
        Object.assign(_style, {
          flex: 1
        })
      }
      return _style
    },

    /**
     * 获取 form-item-wrap 内联样式
     * @param {Object} group 组信息
     * @returns {Object} 内联样式
     */
    getFormItemWrapStyle(group) {
      const { direction } = group
      let { rowshrink } = group
      // 处理 style 属性
      const _style = {}
      // 处理 direction 属性
      if (['around', 'bewteen'].includes(direction)) {
        // space-between、space-around 布局
        Object.assign(_style, {
          justifyContent: `space-${direction}`,
          display: 'flex'
        })
      } else if (direction === 'center') {
        // 居中布局
        Object.assign(_style, {
          justifyContent: 'center',
          display: 'flex'
        })
      } else if (direction === 'left') {
        // 从左往右布局
        Object.assign(_style, {
          justifyContent: 'flex-start',
          display: 'flex'
        })
      } else if (!direction || direction === 'average') {
        // 均分布局
        Object.assign(_style, {
          justifyContent: 'flex-start',
          display: 'flex'
        })
      } else {
        // 均分布局
        Object.assign(_style, {
          justifyContent: 'flex-start',
          display: 'flex'
        })
      }

      // 处理 rowshrink 属性
      typeof rowshrink === 'number' && (rowshrink = `${rowshrink}px`) // 处理 Number 类型
      rowshrink &&
        Object.assign(_style, {
          paddingLeft: rowshrink,
          paddingRight: rowshrink
        })

      return _style
    },

    /**
     * 获取表单控件的内联样式
     * @param {Object} form 表单信息
     * @returns {Object} 内联样式
     */
    getStyle(form) {
      const { style, color } = form
      let { width } = form
      // 处理 style 属性
      const _style = {}
      style && Object.assign(_style, style)
      // 处理 width 属性，width 覆盖 style.width
      typeof width === 'number' && (width = `${width}px`) // 处理 Number 类型
      width && (_style.width = width)
      // 处理 color 属性，color 覆盖 style.color
      color && (_style.color = color)
      return _style
    },

    /**
     * 获取标签文本样式 width
     * @param {Object} form 表单信息
     * @returns {Object} 内联样式
     */
    getLabelWidth(form) {
      // 处理 style 属性
      const _style = {}
      const { labelPosition } = form
      let { labelWidth } = form
      // 处理 labelWidth 属性
      typeof labelWidth === 'number' && (labelWidth = `${labelWidth}px`) // 处理 Number 类型
      labelWidth && (_style.width = labelWidth)
      // 处理 labelPosition 属性
      _style.textAlign = labelPosition || 'right'
      return _style
    },

    /**
     * 手动输入或选择控件选项后，满足以下条件触发:
     * （1）输入框：仅在输入框失去焦点或用户按下回车，并且输入的值发生改变时触发
     * （2）除了输入框以外的控件：选择项发生改变时触发
     * 备注：改变控件绑定的 value 值，不会触发 onChange，必须手动输入或改变选项
     * @param {Object} form 描述
     */
    onChange({ prop, type }) {
      const model = this.model
      //   const model = this.$tool.filterObject(this.model)
      if (type === 'cascader-multi') {
        this.$emit('change', prop, model)
      } else {
        console.log(model, prop)
        this.$emit('input', model)
        this.$emit('change', prop, model)
      }
    },

    // 日期控件
    changedatetime(newVal, { prop }) {
      console.log(newVal, prop)
      const formatVal = (newVal || []).map(item => {
        return this.$tool.getFormatDate(item, 'yyyy-mm-dd MM:mm:ss')
      })
      // this.$emit('input', formatVal)
      this.changeFilter(formatVal, prop)
    },
    /**
    * 改变顶部筛选条件或底部分页时触发
    * 备注：手动改变顶部筛选条件和底部分页时才会触发，父组件若改变筛选项绑定的 value ，则不会触发
    * @param {String} newVal 筛选条件、分页输入的内容
    * @param {String} prop 筛选条件、分页绑定的 value 属性（位于 this.model 下的命名空间）
    */
    changeFilter(newVal, prop) {
      this.$set(this.model, prop, newVal) // 因为控件没有使用 v-model 绑定，导致不会显示控件更改，必须使用 $set
      const model = this.$tool.filterObject(this.model)
      this.$emit('input', model)
      this.$emit('change', { [prop]: newVal }, model)
    },

    /**
     * 下拉框的值改变时触发
     * @param {Array<String | Number> | String | Number} newVal 下拉列表选中的值
     * @param {Object} form 表单信息
     */
    onChangeForSelect(newVal, form) {
      console.log(newVal, form)
      const { type, prop } = form
      if (type === 'mulSelect' || type === 'cascader-multi') {
        // 多选框
        this.tempModel[prop] = newVal
        this.onChange(form)
      } else {
        // 单选框
        this.onChange(form)
      }
    },
    // 下拉框值清空
    onClearForSelect(form) {
      this.$emit('clear', form)
    },

    /**
     * 下拉框出现/隐藏时触发
     * @param {Boolean} isOpen 出现 - true、隐藏 - false
     * @param {Object} form 表单配置项
     */
    onSelectPannelChange(isOpen, form) {
      const { type, prop } = form
      if (type === 'mulSelect' && !isOpen) {
        // 多选切关闭了面板
        this.model[prop] = this.tempModel[prop]
        this.onChange(form)
      }
    },

    /**
     * 渲染控件样式
     */
    renderControlStyle() {
      // @TODO: 根据lable宽度，自动添加错误提示paddingleft
      this.$nextTick(() => {
        const clapItems = this.localItems.reduce((acc, item, index) => {
          return acc.concat(item.items)
        }, [])

        const control = this.$refs.control
        clapItems.forEach((item, index) => {
          if (item.height) {
            Object.assign(control[index].$el.children[0].style, {
              height: item.height,
              lineHeight: item.height
            })
          }
        })
      })
    },

    /**
     * 对部分表单字段进行校验
     * @return Promise.resolve - 校验成功，Promise.reject - 校验失败
     */
    // validateField(prop) {
    //   return new Promise((resove, reject) => {
    //     this.$refs.form.validateField(prop, valid => {
    //       valid ? resove() : reject("validate:fail");
    //     });
    //   });
    // },

    /**
     * 对整个表单进行校验
     * @return Promise.resolve - 校验成功，Promise.reject - 校验失败 自动定位
     */
    validate() {
      return new Promise((resove, reject) => {
        this.$refs.form.validate((valid, object) => {
          //   valid ? resove() : reject('validate:fail')
          if (valid) {
            resove()
          } else {
            for (const i in object) {
              console.log(i)
              const dom = this.$refs.formItem.find(item => item.prop === Object.keys(object)[0])
              dom.$el.scrollIntoView({
                // 滚动到指定节点
                block: 'center', // 值有start,center,end，nearest，当前显示在视图区域中间
                behavior: 'smooth' // 值有auto、instant,smooth，缓动动画（当前是慢速的）
              })
            }
            reject('validate:fail')
          }
        })
      })
    },

    /**
     * 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
     */
    resetFields() {
      this._notFirst = false
      this.$emit('input', this._model)
      this.$refs.form.resetFields()
    },

    /**
     * 校验两个区间的数值
     * @param {Object} 选项：
     *                    min - 最小值、max - 最大值、label 校验对象、callback 校验回调
     */
    validRangeNumber({ min, max, label, callback }) {
      if (this.$tool.isBlank(min)) {
        callback(new Error(`${label}最小值不能为空`))
        // return Promise.reject();
      } else if (this.$tool.isBlank(max)) {
        callback(new Error(`${label}最大值不能为空`))
        // return Promise.reject();
      } else if (min >= max) {
        callback(new Error(`${label}最大值必须大于${label}最小值`))
        // return Promise.reject();
      } else {
        callback()
        // return Promise.resolve();
      }
    },

    /**
     * 校验两个区间的数值
     * @param {Object} 选项：
     *                    value - 待校验数值
     *                    target - 目标数值
     *                    label 待校验对象
     *                    targetLabel 目标对象
     *                    callback 校验回调
     */
    validLessNumber({ target, value, label, targetLabel, callback }) {
      if (this.$tool.isBlank(value)) {
        callback(new Error(`${label}不能为空`))
      } else if (!this.$tool.isBlank(target) && value >= target) {
        callback(new Error(`${label}必须小于${targetLabel}`))
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
