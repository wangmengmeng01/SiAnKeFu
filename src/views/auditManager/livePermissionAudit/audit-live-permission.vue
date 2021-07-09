<template>
  <div class="audit-live-permission">

    <el-button v-if="[1, 2].includes(row.auditStatus)" type="text" size="mini" disabled>已操作</el-button>
    <el-button v-if="row.auditStatus === 0" type="danger" plain size="mini" @click="audit(row.id, 0)">拒绝</el-button>
    <el-button v-if="row.auditStatus === 0" type="success" plain size="mini" @click="audit(row.id, 1)">通过</el-button>

  </div>
</template>

<script>
import API from '@/api/audit-manager'
export default {
  name: 'AuditLivePermission',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    audit(id, logic) {
      this.$confirm(logic === 0 ? `确定要拒绝吗？` : `确认要通过吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await API[this.$route.path].audit({ id, logic })
          this.$message.success('审核完成')
          this.$emit('success')
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

</style>
