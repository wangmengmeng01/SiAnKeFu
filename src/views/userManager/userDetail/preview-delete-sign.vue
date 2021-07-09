<template>
  <div v-if="!!value.voiceSignature && !!value.voiceSignature.url" class="preview-delete-sign">
    <aplayer
      :music="{
        title: '语音签名',
        artist: value.nickName,
        src: value.voiceSignature && value.voiceSignature.url,
        pic: value.avatar
      }"
    />
    <el-button type="text" size="mini" icon="el-icon-delete" style="margin-left: 15px;" @click="deleteVoiceSignature">删除</el-button>
  </div>
</template>

<script>
import API from '@/api/user-manager'
import Aplayer from 'vue-aplayer'
export default {
  name: 'PreviewDeleteSign',
  components: { Aplayer },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    deleteVoiceSignature() {
      this.$confirm(`确认要删除语音标签吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          API[this.$route.path].deleteVoiceSignature({ uid: this.$route.query.uid })
          this.$emit('success')
          this.$message.success('操作成功')
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
.preview-delete-sign {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
