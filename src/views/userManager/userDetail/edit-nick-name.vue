<template>
  <div class="edit-nick-name">
    <div v-if="!onEdit">
      <span>{{ value }}</span>
      <el-button type="text" size="mini" icon="el-icon-edit" style="margin-left: 10px;" @click="init">修改</el-button>
    </div>
    <div v-else>
      <el-input v-model="nickName" size="mini" :maxlength="12" clearable style="width: 150px; margin-right: 10px;" />
      <el-button type="text" size="mini" @click="cancel">取消</el-button>
      <el-button type="text" size="mini" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import API from '@/api/user-manager'
export default {
  name: 'EditNickName',
  props: {
    value: String
  },
  data() {
    return {
      onEdit: false,
      nickName: '',
      loading: false
    }
  },
  methods: {
    init() {
      this.onEdit = true
      this.nickName = this.value
    },
    cancel() {
      this.nickName = ''
      this.onEdit = false
    },
    submit() {
      if (!this.nickName) {
        return this.$message.warning('昵称不能为空')
      }
      API[this.$route.path].editByUid({ uid: this.$route.query.uid, nickName: this.nickName }).then((res) => {
        this.$message.success('操作成功')
        this.$emit('success')
        this.nickName = ''
        this.onEdit = false
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-nick-name {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
