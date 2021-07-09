<template>
  <div class="personal-show-cover">
    <div v-if="!!row.videoCoverResourceUrl" class="personal-show-video" @click="visible = true">
      <el-image
        style="width: 60px; height: 60px;"
        :src="row.videoCoverResourceUrl"
      />
      <svg-icon class="icon-play" icon-class="icon-play" />
    </div>
    <!-- 预览视频弹框 -->
    <el-dialog :visible.sync="visible" top="5vh" append-to-body width="800px">
      <video
        :src="row.videoResourceUrl"
        controls="controls"
        width="100%"
        height="800px"
      />
    </el-dialog>
  </div>
</template>

<script>
  // import DPlayer from 'dplayer';
export default {
  name: 'PersonalShowCover',
  components: {
  },
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.personal-show-cover {
  .personal-show-video {
    position: relative;
    width: 60px;
    height: 60px;
    cursor: pointer;
    .icon-play {
      position: absolute;
      top: 18px;
      left: 18px;
      margin: auto;
      font-size: 24px;
    }
  }
}
</style>
