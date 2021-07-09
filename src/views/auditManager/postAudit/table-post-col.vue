<template>
  <div class="table-post-col">
    <div class="userInfo">
      <el-button type="text" size="mini" class="user-btn" @click="$router.push({path:'/user-manager/user-detail', query:{ uid: row.createBy}})">{{ row.nickName }} &nbsp;&nbsp;（{{ row.saId }}）</el-button>{{ row.createTime }}
    </div>
    <div class="post-text">{{ row.content }}</div>
    <div v-if="!!row.image" class="post-images">
      <el-image
        v-for="(item, index) in row.realImage"
        :key="index"
        style="width: 60px; height: 60px; cursor: pointer;margin-right: 10px;"
        :src="item.url"
        :preview-src-list="row.realImage.map(i => i.url)"
      />
    </div>
    <div v-if="!!row.videoCover" class="post-video" @click="visible = true">
      <el-image
        style="width: 60px; height: 60px;"
        :src="row.realVideoCover.url"
      />
      <svg-icon class="icon-play" icon-class="icon-play" />
    </div>
    <!-- 预览视频弹框 -->
    <el-dialog :visible.sync="visible" top="5vh" append-to-body width="800px">
      <video
        :src="row.video"
        controls="controls"
        width="100%"
        height="800px"
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TablePostCol',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.table-post-col {
  .userInfo {
    .user-btn {
      margin-right: 50px;
    }
  }
  .post-text {
    margin: 10px 0;
  }
  .post-video {
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
