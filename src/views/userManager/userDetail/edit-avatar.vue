<template>
  <div class="edit-avatar">
    <template v-if="!onEdit">
      <el-avatar :size="50" :src="value" />
      <el-button size="mini" type="text" icon="el-icon-edit" style="margin-left: 10px;" @click="init">修改</el-button>
    </template>
    <template v-else>
      <sa-upload v-model="avatar" accept="image/png, image/jpeg, image/jpg" style="width: 50px; height: 50px;" :size="1" />
      <el-button type="text" size="mini" style="margin-left: 10px;" @click="cancel">取消</el-button>
      <el-button type="text" size="mini" @click="submit">确定</el-button>
    </template>
  </div>
</template>

<script>
import API from '@/api/user-manager'
import { fixOssPre } from '@/utils'
import saUpload from '@/components/UploadCloud'
export default {
  name: 'EditAvatar',
  components: { saUpload },
  props: {
    value: String
  },
  data() {
    return {
      onEdit: false,
      avatar: '',
      loading: false
    }
  },
  methods: {
    init() {
      this.onEdit = true
      this.avatar = this.value
    },
    cancel() {
      this.avatar = ''
      this.onEdit = false
    },
    submit() {
      if (!this.avatar) {
        return this.$message.warning('请上传头像')
      }
      this.loading = true
      API[this.$route.path].editByUid({ uid: this.$route.query.uid, avatar: fixOssPre(this.avatar) }).then((res) => {
        this.$message.success('操作成功')
        this.$emit('success')
        this.avatar = ''
        this.loading = false
        this.onEdit = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
