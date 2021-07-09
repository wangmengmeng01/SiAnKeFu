<template>
  <div class="edit-identification">
    <div v-if="true">
      <span>{{ value.name }}</span>
      <!--          <el-button type="text" size="mini" icon="el-icon-edit" @click="init" style="margin-left: 10px;">修改</el-button>-->
    </div>
    <div v-else>
      <dict-select v-model="identificationId" size="mini" :exclude="['-1']" dict-type="user_identification" style="width: 150px; margin-right: 10px;" />
      <el-button type="text" size="mini" @click="cancel">取消</el-button>
      <el-button type="text" size="mini" @click="submit">确定</el-button>
    </div>
  </div>
</template>

<script>
import API from '@/api/user-manager'
import dictSelect from '@/components/DictSelect'
export default {
  name: 'EditIdentification',
  components: { dictSelect },
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      onEdit: false,
      identificationId: '',
      loading: false
    }
  },
  methods: {
    init() {
      this.onEdit = true
      this.identificationId = this.value.id
    },
    cancel() {
      this.identificationId = ''
      this.onEdit = false
    },
    submit() {
      if (!this.identificationId) {
        return this.$message.warning('用户身份不能为空')
      }
      API[this.$route.path].editByUid({ uid: this.$route.query.uid, identificationId: this.identificationId }).then((res) => {
        this.$message.success('操作成功')
        this.$emit('success')
        this.identificationId = ''
        this.onEdit = false
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-identification {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>
