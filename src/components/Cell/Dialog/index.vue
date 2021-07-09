<!-- 对话框组件 -->
<template>
  <!-- 此处的 el-dialog 组件不要使用 visible.sync ，这样会导致父子组件通信方向混乱。但使用此组件时，可以使用 .sync 修饰符 -->
  <el-dialog
    class="dialog"
    :title="title"
    :visible="visible"
    :width="width"
    :close-on-click-modal="false"
    :before-close="beforeClose"
    center
    append-to-body
  >
    <!-- Dialog 的内容 -->
    <slot />

    <!-- Dialog 按钮操作区的内容 -->
    <div v-if="showClose || showOk" slot="footer">
      <el-button v-if="showOk" type="primary" :loading="loading" @click="onOk">{{ okLabel }}</el-button>
      <el-button v-if="showClose" :loading="loading" @click="onCancel">{{ cancelLabel }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: ''
    },

    width: {
      type: String,
      default: '50%'
    },

    /**
     * 点击确认按钮前的回调，会暂停 Dialog 的关闭，根据回调函数返回值，决定是否关闭对话框
     * @returns {Any}
     *                Promise.reject() 不关闭对话框
     *                throws Error 不关闭对话框
     *                Error 不关闭对话框
     *                false 不关闭对话框
     *
     *                Promise.resolve() 关闭对话框
     *                其他任意类型 关闭对话框
     */
    beforeOk: {
      type: Function,
      default: () => {}
    },

    /**
     * 点击取消按钮前的回调，会暂停 Dialog 的关闭，根据回调函数返回值，决定是否关闭对话框
     * @returns {Any}
     *                Promise.reject() 不关闭对话框
     *                throws Error 不关闭对话框
     *                Error 不关闭对话框
     *                false 不关闭对话框
     *
     *                Promise.resolve() 关闭对话框
     *                其他任意类型 关闭对话框
     */
    beforeCancel: {
      type: Function,
      default: () => {}
    },

    /**
     * 是否显示关闭按钮
     */
    showClose: {
      type: Boolean,
      default: true
    },

    /**
     * 是否显示确认按钮
     */
    showOk: {
      type: Boolean,
      default: true
    },

    /**
     * 确定按钮文本
     */
    okLabel: {
      type: String,
      default: '确 定'
    },

    /**
     * 取消按钮文本
     */
    cancelLabel: {
      type: String,
      default: '取 消'
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    /**
     * 点击右上角叉号，或者按下 esc 键，关闭前的回调，会暂停 Dialog 的关闭
     */
    async beforeClose() {
      try {
        this.loading = true
        await this.$tool.wrapPromise(this.beforeCancel)
        // this.localValue = false;
        // 不执行 done 函数关闭 dialog 是正确的，因为在父子组件正确通信的前提下，执行 done 是无法关闭 dialog 的
        this.$emit('update:visible', false)
        this.$emit('cancel-success')
        this.$emit('close')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    /**
     * 点击对话框确认按钮后触发
     */
    async onOk() {
      try {
        this.loading = true
        await this.$tool.wrapPromise(this.beforeOk)
        // this.localValue = false;
        // this.$emit('update:visible', false)
        this.$emit('confirm-success')
        this.$emit('close')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },

    /**
     * 点击对话框取消按钮后触发
     */
    async onCancel() {
      try {
        this.loading = true
        await this.$tool.wrapPromise(this.beforeCancel)
        // this.localValue = false;
        this.$emit('update:visible', false)
        this.$emit('cancel-success')
        this.$emit('close')
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
<style>
</style>
