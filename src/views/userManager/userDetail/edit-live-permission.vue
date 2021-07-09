<template>
  <div class="edit-live-permission">
    <div v-if="!onEdit">
      <span>{{ value? '有': '无' }}</span>
      <el-button type="text" size="mini" icon="el-icon-edit" style="margin-left: 10px;" @click="init">修改</el-button>
    </div>
    <div v-else>
      <el-switch v-model="hasLivePermission" active-text="有" inactive-text="无" active-color="#13ce66" inactive-color="#ff4949" style="margin-right: 10px;" />
      <el-button type="text" size="mini" @click="cancel">取消</el-button>
      <el-button type="text" size="mini" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import API from '@/api/user-manager'
export default {
  name: 'EditLivePermission',
  props: {
    value: Boolean
  },
  data() {
    return {
      onEdit: false,
      hasLivePermission: '',
      loading: false
    }
  },
  methods: {
    init() {
      this.onEdit = true
      this.hasLivePermission = this.value
    },
    cancel() {
      this.hasLivePermission = ''
      this.onEdit = false
    },
    submit() {
      API[this.$route.path].editByUid({ uid: this.$route.query.uid, hasLivePermission: this.hasLivePermission }).then((res) => {
        this.$message.success('操作成功')
        this.$emit('success')
        this.hasLivePermission = ''
        this.onEdit = false
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-live-permission {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
