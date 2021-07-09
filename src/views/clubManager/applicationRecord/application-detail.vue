<template>
  <div class="application-detail">
    <!-- button部分 -->
    <el-button :type="btnType" :size="btnSize" plain @click="init"><slot /></el-button>
    <!-- dialog部分 -->
    <el-dialog title="预览" :visible.sync="visible" :close-on-click-modal="false" top="3vh" append-to-body width="425px">
      <div>
        <div class="title">
          <img :src="row.applyAvatar" style="width:40px;height: 40px;border-radius: 50%">
          <div class="info">
            <div>{{ row.applyNickname }}</div>
            <div>{{ row.applyTime }}</div>
          </div>
        </div>
        <div class="content">
          <div class="media">
            <video
              v-if="row.videoResource"
              :src="row.videoResource.url"
              controls="controls"
              :poster="row.videoCover"
              style="width:180px;height:320px"
            />
            <div v-else class="imgList">
              <el-image
                v-for="(item,index) in (row.picResources || [])"
                :key="index"
                style="width: 45px; height: 80px"
                fit="cover"
                :src="item.url"
                :preview-src-list="Array.isArray(row.picResources)?row.picResources.map(i => i.url):[item.url]"
              />
            </div>
          </div>
          <div class="tit">{{ row.content }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ApplicationDetail',
  props: {
    btnType: {
      type: String,
      default: 'primary'
    },
    btnSize: {
      type: String,
      default: 'mini'
    },
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
  methods: {
    init() {
      this.visible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.application-detail{
  display: inline-block;
  margin: 0 15px;
}
.el-dialog__body {
  max-height: 100px;
  overflow: auto;
}
.title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .info {
    font-weight: bold;
    padding: 5px;
    font-size: 12px;
  }
}
.content {
  padding: 8px 6px;
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .tit {
    padding: 10px 0;
    font-weight: 500;
  }
  .media {
    .imgList {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      &::-webkit-scrollbar {
        width: 5px;
        height: 8px;
      }
      &::-webkit-scrollbar-track {
        // background-color: #f0f0f0;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

        border-radius: 10px;

        background: #ededed;
      }
      &::-webkit-scrollbar-thumb {
        // border-radius: 2px;
        // background-color: #66f;
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

        background: #535353;
      }
      .el-image {
        display: inline-block;
        box-sizing: border-box;
        margin-right: 10px;
      }
    }
  }
  .flex-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    .info {
    }
  }
}
</style>
