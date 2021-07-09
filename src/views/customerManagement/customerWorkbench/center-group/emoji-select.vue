<template>
  <el-popover v-model="visible" placement="top" width="10px" trigger="hover" popper-class="emoji-select">
    <el-scrollbar class="emoji-list">
      <span v-for="(item, index) in emojiList" :key="index" class="emoji-item" @click=" $emit('select', item.unicode)">{{ String.fromCodePoint(item.unicode) }}</span>
    </el-scrollbar>
    <svg-icon slot="reference" icon-class="icon-emoji" style="font-size: 28px; cursor: pointer;" />
  </el-popover>
</template>

<script>
import { emoji_list } from './EmojiList.json'
export default {
  name: 'EmojiSelect',
  data() {
    return {
      visible: false,
      emojiList: [...emoji_list]
    }
  }
}
</script>

<style scoped lang="scss">
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .emoji-select{
    .emoji-list{
      width: 200px;
      height: 150px;
      .emoji-item{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        cursor: pointer;
        &:hover{
          background: #E5EFFF;
        }
      }
    }
  }
</style>
