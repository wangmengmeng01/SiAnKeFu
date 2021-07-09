<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="个人秀打赏配置">
        <like-config type='1' label="单次打赏金额（钻石）" />
      </el-tab-pane>
      <el-tab-pane label="通话余额不足提醒">
        <like-config type='2' label="当不足此时间时，会推送提醒"/>
      </el-tab-pane>
      <el-tab-pane label="非会员私信限制">
        <like-config type='3' label="每日私信总条数"/>
      </el-tab-pane>
      <el-tab-pane label="非会员浏览限制">
        <like-config type='4' label="每日主页浏览总次数"/>
      </el-tab-pane>

      <!-- <el-tab-pane label="世界频道发言金额配置">
        <channel-config />
      </el-tab-pane>
      <el-tab-pane label="每日红包金额配置">
        <repacket-config />
      </el-tab-pane>
      <el-tab-pane label="俱乐部任务打赏金额配置">
        <task-config />
      </el-tab-pane>
      <el-tab-pane label="俱乐部心情打赏金额配置">
        <mood-config />
      </el-tab-pane>
      <el-tab-pane label="直播间广告位入口配置">
        <ad-position-config />
      </el-tab-pane>
      <el-tab-pane label="联系方式配置">
        <contact-config />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>

import likeConfig from './likeConfig'
import repacketConfig from './repacketConfig'
import channelConfig from './channelConfig'
import moodConfig from './moodConfig'
import taskConfig from './taskConfig'
import adPositionConfig from './adPositionConfig'
import contactConfig from './contactConfig.vue'

export default {
  name: 'ConfigManager',
  components: {
    likeConfig,
    repacketConfig,
    channelConfig,
    moodConfig,
    taskConfig,
    adPositionConfig,
    contactConfig
  },
  data() {
    return {

    }
  },
  beforeCreate() {
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

</style>
