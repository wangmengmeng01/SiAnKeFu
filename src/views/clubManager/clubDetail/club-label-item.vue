<template>
  <div class="item-layout">
    <div class="item-label">
      {{ label }}
    </div>
    <div class="item-content">
      <slot>{{ value | valueParse }}</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LabelValueItem',
  filters: {
    valueParse(val) {
      if (Array.isArray(val) && val.length === 0) {
        return ''
      } else {
        return val
      }
    }
  },
  props: {
    label: String,
    value: [String, Number, Boolean, Array, Object]
  }
}
</script>
<style lang="scss" scoped>
.item-layout {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    min-height: 50px;
    .item-label {
        width: 200px;
        min-width: 200px;
        font-weight: 500;
        height: 50px;
        line-height: 50px;
        align-self: flex-start;
        text-align: right;
        &::after {
            content: '：'
        }
    }
    .item-content {
        flex: auto;
        padding-left: 10px;
        font-size: 15px;
    }
}
</style>
