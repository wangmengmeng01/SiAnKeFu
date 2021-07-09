<template>
  <div>
    <el-form ref="dataForm" :disabled="!isEdit" :model="form" label-width="150px" style="width: 660px; margin-top: 20px;">
      <el-form-item label="爆灯礼物入口开关：">
        <el-radio-group v-model="form.hasFreeCardEntrance" @change="seletedChange">
          <el-radio :label="true">打开</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="俱乐部入口开关：">
        <el-radio-group v-model="form.hasClubEntrance" @change="seletedChange">
          <el-radio :label="true">打开</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="直播间飘屏配置：">
        <el-radio-group v-model="form.hasHorseRaceLamp" @change="seletedChange">
          <el-radio :label="true">打开</el-radio>
          <el-radio :label="false">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form label-width="100px">
      <el-form-item>
        <el-row type="flex" align="middle" style="margin-top: 20px; margin-bottom: 40px;">
          <el-button v-show="!isEdit" type="primary" @click="isEdit = true">修改配置</el-button>
          <el-button v-show="isEdit" type="primary" style="width: 100px; margin-right: 20px;" @click="submit">保存配置</el-button>
          <el-button v-show="isEdit" type="primary" style="width: 100px;" @click="cancelEdit">恢复</el-button>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import API from '@/api/common-manager'
export default {
  components: {

  },
  data() {
    return {
      isEdit: false,
      form: {
        hasFreeCardEntrance: false,
        hasClubEntrance: false,
        hasHorseRaceLamp: false
      }
    }
  },
  created() {
    this.$api = API[this.$route.path]
    this.getConfig()
  },
  methods: {
    async getConfig() {
      const { data } = await this.$api.getLiveRoomConfig({})
      if (data.configInfo) {
        this.form = data.configInfo
      }
    },
    async submit() {
      await this.$api.saveLiveRoomConfig({ configInfo: this.form })
      this.getConfig()
      this.$message.success('操作成功')
      this.isEdit = false
    },
    cancelEdit() {
      this.isEdit = false
      this.getConfig()
    },
    seletedChange(value) {
      // debugger
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
